from pathlib import Path
import re

INDEX = Path('index.html')
MIDDLEWARE = Path('functions/_middleware.js')

s = INDEX.read_text(encoding='utf-8')
m = MIDDLEWARE.read_text(encoding='utf-8')

MARKER = 'NAVIGATION_HARDENING_2026_08_16'
if MARKER in s:
    raise SystemExit('Navigation hardening already applied')

def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected 1 occurrence, found {count}')
    return text.replace(old, new, 1)

# Fail closed even if a mobile browser restores stale classes or CSS arrives late.
s = replace_once(
    s,
    '  *{ box-sizing: border-box; }\n  html,body{ height:100%; }',
    f'''  *{{ box-sizing: border-box; }}\n  [hidden]{{ display:none!important; }}\n  /* {MARKER}: every app view starts hidden and only the router reveals one target. */\n  html,body{{ height:100%; }}''',
    'global hidden safeguard'
)

# Every page is hidden in raw HTML. JavaScript must explicitly reveal exactly one.
s, page_count = re.subn(r'(<div class="page" id="[^"]+")(>)', r'\1 hidden\2', s)
if page_count < 8:
    raise SystemExit(f'page hidden attributes: expected at least 8 pages, updated {page_count}')

# Real hrefs provide a one-click browser fallback; account/admin deliberately use full route loads.
old_nav = '''  <div class="nav-actions" id="navActions">
    <button class="nav-btn" id="navHomeBtn" onclick="goHome()">Home</button>
    <button class="nav-btn" id="navBlogBtn" onclick="goPublic()">Blog</button>
    <button class="nav-btn" id="navBooksBtn" onclick="goBooks()">Books</button>
    <button class="nav-btn" id="navResourcesBtn" onclick="goResources()">Resources</button>
    <button class="nav-btn" id="navAboutBtn" onclick="goAbout()">About</button>
    <button class="nav-btn" id="navAccountBtn" onclick="goReaderAccount()">Reader sign in</button>
    <button class="nav-btn" id="navAdminBtn" style="display:none" onclick="goAdminEntry()">Admin</button>'''
new_nav = '''  <div class="nav-actions" id="navActions">
    <a class="nav-btn" id="navHomeBtn" href="/" onclick="goHome();return false">Home</a>
    <a class="nav-btn" id="navBlogBtn" href="/blog" onclick="goPublic();return false">Blog</a>
    <a class="nav-btn" id="navBooksBtn" href="/books" onclick="goBooks();return false">Books</a>
    <a class="nav-btn" id="navResourcesBtn" href="/resources" onclick="goResources();return false">Resources</a>
    <a class="nav-btn" id="navAboutBtn" href="/about" onclick="goAbout();return false">About</a>
    <a class="nav-btn" id="navAccountBtn" href="/account">Reader sign in</a>
    <a class="nav-btn" id="navAdminBtn" href="/admin" hidden>Admin</a>'''
s = replace_once(s, old_nav, new_nav, 'top navigation links')
s = replace_once(
    s,
    '<button class="nav-btn ghost-danger" id="navLogoutBtn" style="display:none" onclick="logout()">Log out</button>',
    '<button class="nav-btn ghost-danger" id="navLogoutBtn" hidden onclick="logout()">Log out</button>',
    'logout hidden default'
)

# Signup CTA must work even when Cloudflare intentionally strips the account DOM from public pages.
s = replace_once(
    s,
    '<button class="btn btn-primary" type="button" onclick="goReaderSignup()">Create a reader account <span aria-hidden="true">&rarr;</span></button>',
    '<a class="btn btn-primary" href="/account?mode=signup">Create a reader account <span aria-hidden="true">&rarr;</span></a>',
    'home reader signup link'
)

old_show = '''function showPage(id){

  closeMobileNav();

  document
    .querySelectorAll('.page')
    .forEach(p => p.classList.remove('visible'));

  document
    .getElementById(id)
    .classList.add('visible');

  window.scrollTo(0,0);

  syncNavButtons(id);

  if(id !== 'view-blog-post'){
    document.title = 'Mind Over Matter | Psychology Essays by Stephen Leynard';
    const progress = document.getElementById('readingProgress');
    if(progress) progress.style.width = '0';
  }
}'''
new_show = '''function hideAllPages(){
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('visible');
    page.hidden = true;
    page.setAttribute('aria-hidden','true');
  });
}

function showPage(id){
  closeMobileNav();
  const target = document.getElementById(id);
  if(!target){
    console.error(`Route target is unavailable: ${id}`);
    return false;
  }

  hideAllPages();
  target.hidden = false;
  target.removeAttribute('aria-hidden');
  target.classList.add('visible');

  window.scrollTo(0,0);
  syncNavButtons(id);

  if(id !== 'view-blog-post'){
    document.title = 'Mind Over Matter | Psychology Essays by Stephen Leynard';
    const progress = document.getElementById('readingProgress');
    if(progress) progress.style.width = '0';
  }
  return true;
}'''
s = replace_once(s, old_show, new_show, 'showPage fail-closed router')

# Hash fallback should never call a stripped admin function on a public shell.
s = replace_once(
    s,
    '''window.addEventListener('hashchange', () => {
  if(window.location.hash.toLowerCase() === '#admin') goAdminEntry();
});''',
    '''window.addEventListener('hashchange', () => {
  if(window.location.hash.toLowerCase() !== '#admin') return;
  if(document.getElementById('view-login')) goAdminEntry();
  else location.assign('/admin');
});''',
    'admin hash fallback'
)

# Built-in hidden semantics are safer than relying on inline display styles.
s = replace_once(
    s,
    '''  document
    .getElementById('navAdminBtn')
    .style.display = isOwner()
      ? 'inline-flex'
      : 'none';

  document
    .getElementById('navLogoutBtn')
    .style.display = isSignedIn()
      ? 'inline-flex'
      : 'none';''',
    '''  document.getElementById('navAdminBtn').hidden = !isOwner();
  document.getElementById('navLogoutBtn').hidden = !isSignedIn();''',
    'fail-closed nav visibility'
)

# Ordinary signed-in readers should always use the anonymous public post policy; only owner reads use owner auth.
s = replace_once(s, '  const useAuth = isSignedIn();\n  try{\n    posts = await supabaseRequest(path, { auth:useAuth });', '  const useAuth = isOwner();\n  try{\n    posts = await supabaseRequest(path, { auth:useAuth });', 'owner-only authenticated post load')

# Verify the stored owner session with Supabase before rendering the dashboard.
insert_after = '''function isSignedIn(){
  return Boolean(getAuthSession()?.access_token);
}
'''
verify_fn = '''
async function verifyOwnerSession(){
  const session = getAuthSession();
  if(!session?.access_token || session.user?.id !== ADMIN_USER_ID) return false;
  const token = await getAccessToken();
  if(!token) return false;
  try{
    const response = await fetch(`${SUPABASE_AUTH_URL}user`, {
      headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${token}` },
      cache:'no-store'
    });
    if(!response.ok) return false;
    const user = await response.json();
    if(user?.id !== ADMIN_USER_ID) return false;
    const current = getAuthSession();
    if(current) storeAuthSession({ ...current, user });
    return true;
  }catch(error){
    console.error('Owner session verification failed', error);
    return false;
  }
}
'''
s = replace_once(s, insert_after, insert_after + verify_fn, 'owner verification function')

old_account = '''function goReaderAccount(){
  pushRoute('/account');
  const form = document.querySelector('#view-account form');
  const preferences = document.getElementById('readerPreferences');
  const dangerZone = document.getElementById('readerDangerZone');
  const deleteConfirm = document.getElementById('readerDeleteConfirm');
  if(isSignedIn()){
    const session = getAuthSession();
    document.getElementById('readerAuthTitle').textContent = 'Your reader account';
    document.getElementById('readerAuthCopy').textContent = session?.user?.email || 'Signed in';
    document.getElementById('displayNameField').style.display = 'none';
    form.style.display = 'none';
    preferences.classList.add('visible');
    if(dangerZone) dangerZone.hidden = isOwner();
    if(deleteConfirm) deleteConfirm.hidden = true;
    document.querySelector('#view-account .auth-switch').innerHTML = '<button type="button" onclick="logout()">Sign out</button>';
    loadNewsletterPreferences();
  }else{
    form.style.display = 'block';
    preferences.classList.remove('visible');
    if(dangerZone) dangerZone.hidden = true;
    if(deleteConfirm) deleteConfirm.hidden = true;
    document.querySelector('#view-account .auth-switch').innerHTML = '<span id="readerAuthSwitchCopy">New here?</span> <button type="button" onclick="toggleReaderAuthMode()" id="readerAuthSwitch">Create an account</button>';
    setReaderAuthMode('signin');
  }
  showPage('view-account');
  document.title = isSignedIn()
    ? 'Reader Account | Mind Over Matter'
    : 'Reader Sign In | Mind Over Matter';
}

function goReaderSignup(){
  goReaderAccount();
  if(!isSignedIn()) setReaderAuthMode('signup');
}'''
new_account = '''function goReaderAccount(){
  if(!document.getElementById('view-account')){
    location.assign('/account');
    return;
  }
  const requestedMode = new URLSearchParams(location.search).get('mode');
  pushRoute('/account');
  const form = document.querySelector('#view-account form');
  const preferences = document.getElementById('readerPreferences');
  const dangerZone = document.getElementById('readerDangerZone');
  const deleteConfirm = document.getElementById('readerDeleteConfirm');
  if(isSignedIn()){
    const session = getAuthSession();
    document.getElementById('readerAuthTitle').textContent = 'Your reader account';
    document.getElementById('readerAuthCopy').textContent = session?.user?.email || 'Signed in';
    document.getElementById('displayNameField').style.display = 'none';
    form.style.display = 'none';
    preferences.classList.add('visible');
    if(dangerZone) dangerZone.hidden = isOwner();
    if(deleteConfirm) deleteConfirm.hidden = true;
    document.querySelector('#view-account .auth-switch').innerHTML = '<button type="button" onclick="logout()">Sign out</button>';
    loadNewsletterPreferences();
  }else{
    form.style.display = 'block';
    preferences.classList.remove('visible');
    if(dangerZone) dangerZone.hidden = true;
    if(deleteConfirm) deleteConfirm.hidden = true;
    document.querySelector('#view-account .auth-switch').innerHTML = '<span id="readerAuthSwitchCopy">New here?</span> <button type="button" onclick="toggleReaderAuthMode()" id="readerAuthSwitch">Create an account</button>';
    setReaderAuthMode(requestedMode === 'signup' ? 'signup' : 'signin');
  }
  showPage('view-account');
  document.title = isSignedIn()
    ? 'Reader Account | Mind Over Matter'
    : 'Reader Sign In | Mind Over Matter';
}

function goReaderSignup(){
  if(!document.getElementById('view-account')){
    location.assign('/account?mode=signup');
    return;
  }
  history.replaceState(history.state || {}, '', '/account?mode=signup');
  goReaderAccount();
  if(!isSignedIn()) setReaderAuthMode('signup');
}'''
s = replace_once(s, old_account, new_account, 'reader route fallback')

old_admin = '''function goAdminEntry(){

  pushRoute('/admin');

  if(isAuthed()){
    goDashboard();
  }else{

    document
      .getElementById('loginError')
      .classList
      .remove('visible');

    document.getElementById('adminEmail').value = '';
    document.getElementById('pw').value = '';

    showPage('view-login');
  }
}'''
new_admin = '''async function goAdminEntry(){
  if(!document.getElementById('view-login')){
    location.assign('/admin');
    return;
  }

  pushRoute('/admin');
  hideAllPages();

  if(await verifyOwnerSession()){
    await goDashboard();
    return;
  }

  if(isOwner()) clearAuthSession();
  document.getElementById('loginError').classList.remove('visible');
  document.getElementById('adminEmail').value = '';
  document.getElementById('pw').value = '';
  showPage('view-login');
}'''
s = replace_once(s, old_admin, new_admin, 'verified admin route')

# Article sign-in fallback no longer depends on late middleware-injected JavaScript.
s = replace_once(
    s,
    '''function requireReaderSignIn(postId){
  sessionStorage.setItem('mindovermatter_return_post', String(postId));
  goReaderAccount();
}''',
    '''function requireReaderSignIn(postId){
  sessionStorage.setItem('mindovermatter_return_post', String(postId));
  if(!document.getElementById('view-account')){
    location.assign('/account');
    return;
  }
  goReaderAccount();
}''',
    'article reader sign-in fallback'
)

# Back-forward cache restores are re-routed from a hidden, known state.
s = replace_once(
    s,
    "window.addEventListener('popstate', () => routeFromLocation(true));",
    """window.addEventListener('popstate', () => routeFromLocation(true));
window.addEventListener('pageshow', event => {
  if(!event.persisted) return;
  hideAllPages();
  Promise.resolve(routeFromLocation(false)).catch(error => {
    console.error('Could not restore route from browser cache', error);
    location.reload();
  });
});""",
    'bfcache route recovery'
)

s = replace_once(s, '  goHome(false);\n}\n\nfunction renderTable(){', '  return goHome(false);\n}\n\nfunction renderTable(){', 'route fallback return')

old_init = '''(async function init(){

  updateThemeToggle();
  document.getElementById('footerYear').textContent = new Date().getFullYear();
  showPage('view-landing');
  document.getElementById('landingPostCount').textContent = 'Loading essays…';

  try{
    await consumeAuthCallback();
    await loadPosts();
    if(window.location.hash.toLowerCase() === '#admin'){
      goAdminEntry();
    }else if(location.pathname.startsWith('/blog/')){
      routeFromLocation();
    }else if(location.pathname === '/blog' || location.pathname === '/blog/'){
      goPublic(false);
    }else if(location.pathname === '/books' || location.pathname === '/books/'){
      goBooks();
    }else if(location.pathname === '/resources' || location.pathname === '/resources/'){
      goResources();
    }else if(location.pathname === '/about' || location.pathname === '/about/'){
      goAbout();
    }else if(location.pathname === '/account' || location.pathname === '/account/'){
      goReaderAccount();
    }else if(location.pathname === '/admin' || location.pathname === '/admin/'){
      goAdminEntry();
    }else{
      goHome(false);
    }
  }catch(error){
    console.error(error);
    document.getElementById('landingPostCount').textContent = 'Essays unavailable';
    showToast('Could not connect to the blog');
  }

})();'''
new_init = '''(async function init(){
  updateThemeToggle();
  document.getElementById('footerYear').textContent = new Date().getFullYear();
  hideAllPages();
  document.getElementById('landingPostCount').textContent = 'Loading essays…';

  try{
    await consumeAuthCallback();

    if(window.location.hash.toLowerCase() === '#admin' || location.pathname === '/admin' || location.pathname === '/admin/'){
      await goAdminEntry();
      return;
    }

    if(location.pathname === '/account' || location.pathname === '/account/'){
      goReaderAccount();
      return;
    }

    await loadPosts();
    await routeFromLocation(false);
  }catch(error){
    console.error(error);
    hideAllPages();
    if(location.pathname === '/admin' || location.pathname === '/admin/'){
      await goAdminEntry();
      return;
    }
    if(location.pathname === '/account' || location.pathname === '/account/'){
      goReaderAccount();
      return;
    }
    document.getElementById('landingPostCount').textContent = 'Essays unavailable';
    showPage('view-landing');
    showToast('Could not connect to the blog');
  }
})();'''
s = replace_once(s, old_init, new_init, 'startup routing')

# Middleware: account and admin shells are isolated from one another. Public routes receive neither.
old_private = '''const PRIVATE_SELECTORS = [
  '#view-account',
  '#view-login',
  '#view-dashboard',
  '#view-book-editor',
  '#view-editor',
  '#deleteModal',
  '#bookDeleteModal'
];'''
new_private = '''const ACCOUNT_SELECTORS = [
  '#view-account'
];

const ADMIN_SELECTORS = [
  '#view-login',
  '#view-dashboard',
  '#view-book-editor',
  '#view-editor',
  '#deleteModal',
  '#bookDeleteModal'
];'''
m = replace_once(m, old_private, new_private, 'middleware selector split')

private_guard_pattern = re.compile(r'''\nclass PrivateRouteGuard \{.*?\n\}\n\nclass LegalHeadAssets''', re.S)
m, guard_count = private_guard_pattern.subn('\nclass LegalHeadAssets', m, count=1)
if guard_count != 1:
    raise SystemExit(f'middleware private guard removal: expected 1, found {guard_count}')

m = replace_once(
    m,
    "  const privateShell = path === '/account' || path === '/admin';\n  const standaloneLegalPage",
    "  const accountShell = path === '/account';\n  const adminShell = path === '/admin';\n  const standaloneLegalPage",
    'middleware shell flags'
)

old_rewrite = '''  if (!privateShell && !standaloneLegalPage) {
    for (const selector of PRIVATE_SELECTORS) {
      rewriter = rewriter.on(selector, new RemoveElement());
    }
    rewriter = rewriter.on('body', new PrivateRouteGuard());
  }'''
new_rewrite = '''  if (!standaloneLegalPage) {
    if (!accountShell) {
      for (const selector of ACCOUNT_SELECTORS) {
        rewriter = rewriter.on(selector, new RemoveElement());
      }
    }
    if (!adminShell) {
      for (const selector of ADMIN_SELECTORS) {
        rewriter = rewriter.on(selector, new RemoveElement());
      }
    }
  }'''
m = replace_once(m, old_rewrite, new_rewrite, 'middleware route isolation')

INDEX.write_text(s, encoding='utf-8')
MIDDLEWARE.write_text(m, encoding='utf-8')
print(f'Applied navigation hardening to {page_count} page views.')
