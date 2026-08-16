from pathlib import Path
import re

INDEX = Path('index.html')
PRIVACY = Path('functions/privacy.js')
TERMS = Path('functions/terms.js')

s = INDEX.read_text(encoding='utf-8')


def replace_exact(old, new, label, count=1):
    global s
    found = s.count(old)
    if found != count:
        raise SystemExit(f'{label}: expected {count} match(es), found {found}')
    s = s.replace(old, new, count)


def replace_regex(pattern, repl, label, count=1):
    global s
    s, found = re.subn(pattern, repl, s, count=count, flags=re.S)
    if found != count:
        raise SystemExit(f'{label}: expected {count} match(es), found {found}')


# ---------- shared CSS ----------
css = r'''

  /* Admin publish controls, editor navigation, and reader account controls */
  .publish-state{
    display:inline-flex;align-items:center;gap:8px;min-height:34px;padding:5px 10px 5px 7px;
    border:1px solid var(--rule);border-radius:999px;background:transparent;color:var(--ink-soft);
    font-size:12px;font-weight:700;letter-spacing:.02em;
    transition:border-color .15s ease,background .15s ease,color .15s ease,transform .15s ease;
  }
  .publish-state:hover{border-color:var(--gold);color:var(--gold-soft);transform:translateY(-1px)}
  .publish-check{width:19px;height:19px;display:grid;place-items:center;flex:none;border:1px solid var(--ink-faint);border-radius:5px;font-size:13px;font-weight:800;line-height:1}
  .publish-state.is-published{color:var(--gold-soft);border-color:var(--gold);background:var(--gold-15)}
  .publish-state.is-published .publish-check{background:var(--gold);border-color:var(--gold);color:var(--on-accent)}
  .publish-state.is-draft .publish-check{background:transparent}
  .view-count-cell{font-variant-numeric:tabular-nums;font-weight:700;color:var(--ink-soft);white-space:nowrap}
  .editor-nav-row{display:flex;align-items:center;margin:0 0 14px}
  .editor-back-link{display:inline-flex;align-items:center;gap:7px;min-height:34px;padding:6px 11px;border:1px solid var(--rule);border-radius:999px;background:transparent;color:var(--ink-soft);font-size:12.5px;font-weight:650;transition:border-color .15s ease,color .15s ease,background .15s ease}
  .editor-back-link:hover{border-color:var(--gold);color:var(--gold-soft);background:var(--gold-15)}
  .reader-danger-zone{margin-top:30px;padding-top:24px;border-top:1px solid var(--rule);text-align:left}
  .reader-danger-zone[hidden],.reader-delete-confirm[hidden]{display:none!important}
  .reader-danger-zone h3{margin:7px 0 7px;font:600 22px/1.2 var(--font-display);color:var(--ink)}
  .reader-danger-zone p{margin:0;color:var(--ink-soft);font-size:13px;line-height:1.6}
  .reader-danger-actions{display:flex;align-items:center;gap:10px;margin-top:14px;flex-wrap:wrap}
  .btn-danger-outline{border:1px solid var(--danger);background:var(--danger-15);color:var(--danger-text)}
  .btn-danger-outline:hover{border-color:var(--danger);color:var(--danger-text);background:var(--danger-15)}
  .reader-delete-confirm{margin-top:14px;padding:15px;border:1px solid var(--danger);border-radius:12px;background:var(--danger-15)}
  .reader-delete-confirm strong{display:block;margin-bottom:5px;color:var(--ink)}
  .reader-delete-status{min-height:18px;margin-top:9px!important;color:var(--danger-text)!important}
  @media(max-width:700px){.publish-state{min-height:40px;font-size:11.5px}.reader-danger-actions{display:grid;grid-template-columns:1fr}.reader-danger-actions .btn{width:100%;justify-content:center}}
'''
replace_exact('\n</style>\n</head>', css + '\n</style>\n</head>', 'insert final CSS')

# ---------- editor navigation ----------
replace_regex(
    r'<button class="page-home-link" onclick="goHome\(\)" aria-label="Back to home">Home</button>\s*<button class="btn-text" onclick="goDashboard\(\)">\s*&larr; Back to dashboard\s*</button>',
    '<div class="editor-nav-row"><button class="editor-back-link" type="button" onclick="goDashboard()" aria-label="Back to dashboard"><span aria-hidden="true">←</span> Dashboard</button></div>',
    'editor navigation',
    2,
)

# ---------- post table: status + views ----------
replace_exact(
    '<th style="width:46%">Post</th>\n            <th>Status</th>\n            <th>Created</th>',
    '<th style="width:42%">Post</th>\n            <th>Status</th>\n            <th>Views</th>\n            <th>Created</th>',
    'post table headers',
)
replace_exact('colspan="4">\n          No posts here yet.', 'colspan="5">\n          No posts here yet.', 'empty post colspan')
replace_regex(
    r'<td>\s*<span class="badge \$\{p\.published \? \'published\' : \'draft\'\}">\s*\$\{p\.published \? \'published\' : \'draft\'\}\s*</span>\s*</td>',
    '''<td>
          <button class="publish-state ${p.published ? 'is-published' : 'is-draft'}" type="button" title="${p.published ? 'Published — click to move to draft' : 'Draft — click to publish'}" aria-label="${p.published ? 'Published. Move post to draft' : 'Draft. Publish post'}" onclick="toggleStatus(${p.id})">
            <span class="publish-check" aria-hidden="true">${p.published ? '✓' : ''}</span><span>${p.published ? 'Published' : 'Draft'}</span>
          </button>
        </td>

        <td class="view-count-cell" title="Article views">
          ${Number(p.view_count || 0).toLocaleString()}
        </td>''',
    'post status and views',
)
replace_regex(
    r'\s*<button\s+class="btn-icon"\s+title="\$\{p\.published \? \'Move to draft\' : \'Publish\'\}"\s+onclick="toggleStatus\(\$\{p\.id\}\)"\s*>.*?</button>\s*(?=<button\s+class="btn-icon"\s+title="Edit")',
    '\n            ',
    'remove redundant post publish action',
)

# ---------- books: status itself is the toggle ----------
old_book_status = '<td><span class="badge ${book.published ? \'published\' : \'draft\'}">${book.published ? \'published\' : \'draft\'}</span></td>'
new_book_status = '<td><button class="publish-state ${book.published ? \'is-published\' : \'is-draft\'}" type="button" title="${book.published ? \'Published — click to move to draft\' : \'Draft — click to publish\'}" aria-label="${book.published ? \'Published. Move book to draft\' : \'Draft. Publish book\'}" onclick="toggleBookStatus(${book.id})"><span class="publish-check" aria-hidden="true">${book.published ? \'✓\' : \'\'}</span><span>${book.published ? \'Published\' : \'Draft\'}</span></button></td>'
replace_exact(old_book_status, new_book_status, 'book status toggle')
old_book_action = '<button class="btn-icon" title="${book.published ? \'Move to draft\' : \'Publish\'}" aria-label="${book.published ? \'Move book to draft\' : \'Publish book\'}" onclick="toggleBookStatus(${book.id})">${book.published ? \'&#9675;\' : \'&#9679;\'}</button>\n          '
replace_exact(old_book_action, '', 'remove redundant book publish action')

# ---------- reader account deletion UI ----------
pref_actions = '''        <div class="preference-actions">
          <button class="btn btn-primary" type="button" id="readerPreferencesSave" onclick="saveNewsletterPreferences()">Save preferences</button>
          <p class="preference-status" id="readerPreferencesStatus" role="status" aria-live="polite"></p>
        </div>
'''
danger = '''
        <div class="reader-danger-zone" id="readerDangerZone" hidden>
          <div class="eyebrow">Account controls</div>
          <h3>Delete reader account</h3>
          <p>Permanently removes your reader profile, comments, likes, newsletter preferences, and sign-in account. This cannot be undone.</p>
          <div class="reader-danger-actions"><button class="btn btn-danger-outline" type="button" onclick="requestReaderAccountDeletion()">Delete my account</button></div>
          <div class="reader-delete-confirm" id="readerDeleteConfirm" hidden>
            <strong>Delete your account permanently?</strong>
            <p>Your reader data will be removed and you will be signed out immediately.</p>
            <div class="reader-danger-actions">
              <button class="btn btn-danger-outline" type="button" id="readerDeleteConfirmBtn" onclick="deleteReaderAccount()">Yes, delete permanently</button>
              <button class="btn btn-outline" type="button" onclick="cancelReaderAccountDeletion()">Cancel</button>
            </div>
            <p class="reader-delete-status" id="readerDeleteStatus" role="status" aria-live="polite"></p>
          </div>
        </div>
'''
replace_exact(pref_actions, pref_actions + danger, 'reader deletion UI')

# ---------- configuration ----------
replace_exact(
    "const SUPABASE_REST_URL = 'https://ljseqpciuohncchdcewa.supabase.co/rest/v1/';",
    "const SUPABASE_REST_URL = 'https://ljseqpciuohncchdcewa.supabase.co/rest/v1/';\nconst SUPABASE_FUNCTIONS_URL = 'https://ljseqpciuohncchdcewa.supabase.co/functions/v1/';",
    'functions URL',
)
replace_exact(
    "const POST_COLUMNS = 'id,created_at,updated_at,title,body,published,slug,category,summary,featured,publish_at,cover_image_url';",
    "const POST_COLUMNS = 'id,created_at,updated_at,title,body,published,slug,category,summary,featured,publish_at,cover_image_url,view_count';",
    'post view column',
)
replace_exact(
    "const BLOG_SCROLL_KEY = 'mindovermatter_blog_scroll';",
    "const BLOG_SCROLL_KEY = 'mindovermatter_blog_scroll';\nconst POST_VIEW_SESSION_KEY = 'mindovermatter_viewed_posts';",
    'view session key',
)

# ---------- deterministic /admin routing ----------
replace_exact('function goAdminEntry(){\n\n', "function goAdminEntry(){\n\n  pushRoute('/admin');\n\n", 'admin route push')
replace_exact(
    "  if(location.pathname === '/account' || location.pathname === '/account/') return goReaderAccount();\n  goHome(false);",
    "  if(location.pathname === '/account' || location.pathname === '/account/') return goReaderAccount();\n  if(location.pathname === '/admin' || location.pathname === '/admin/') return goAdminEntry();\n  goHome(false);",
    'popstate admin route',
)
replace_exact(
    "    }else if(location.pathname === '/account' || location.pathname === '/account/'){\n      goReaderAccount();\n    }else{",
    "    }else if(location.pathname === '/account' || location.pathname === '/account/'){\n      goReaderAccount();\n    }else if(location.pathname === '/admin' || location.pathname === '/admin/'){\n      goAdminEntry();\n    }else{",
    'initial admin route',
)

# ---------- show delete controls only for reader accounts ----------
replace_exact(
    "  const preferences = document.getElementById('readerPreferences');\n  if(isSignedIn()){",
    "  const preferences = document.getElementById('readerPreferences');\n  const dangerZone = document.getElementById('readerDangerZone');\n  const deleteConfirm = document.getElementById('readerDeleteConfirm');\n  if(isSignedIn()){",
    'reader danger refs',
)
replace_exact(
    "    preferences.classList.add('visible');\n    document.querySelector('#view-account .auth-switch').innerHTML = '<button type=\"button\" onclick=\"logout()\">Sign out</button>';",
    "    preferences.classList.add('visible');\n    if(dangerZone) dangerZone.hidden = isOwner();\n    if(deleteConfirm) deleteConfirm.hidden = true;\n    document.querySelector('#view-account .auth-switch').innerHTML = '<button type=\"button\" onclick=\"logout()\">Sign out</button>';",
    'reader danger show',
)
replace_exact(
    "    preferences.classList.remove('visible');\n    document.querySelector('#view-account .auth-switch').innerHTML = '<span id=\"readerAuthSwitchCopy\">New here?</span> <button type=\"button\" onclick=\"toggleReaderAuthMode()\" id=\"readerAuthSwitch\">Create an account</button>';",
    "    preferences.classList.remove('visible');\n    if(dangerZone) dangerZone.hidden = true;\n    if(deleteConfirm) deleteConfirm.hidden = true;\n    document.querySelector('#view-account .auth-switch').innerHTML = '<span id=\"readerAuthSwitchCopy\">New here?</span> <button type=\"button\" onclick=\"toggleReaderAuthMode()\" id=\"readerAuthSwitch\">Create an account</button>';",
    'reader danger hide',
)

# ---------- deletion functions ----------
delete_js = r'''
function requestReaderAccountDeletion(){
  if(!isSignedIn()) return goReaderAccount();
  if(isOwner()) return showToast('The site owner account cannot be deleted here.');
  const box = document.getElementById('readerDeleteConfirm');
  const status = document.getElementById('readerDeleteStatus');
  if(status) status.textContent = '';
  if(box) box.hidden = false;
}

function cancelReaderAccountDeletion(){
  const box = document.getElementById('readerDeleteConfirm');
  const status = document.getElementById('readerDeleteStatus');
  if(box) box.hidden = true;
  if(status) status.textContent = '';
}

async function deleteReaderAccount(){
  if(isOwner()) return showToast('The site owner account cannot be deleted here.');
  const token = await getAccessToken();
  if(!token) return goReaderAccount();
  const button = document.getElementById('readerDeleteConfirmBtn');
  const status = document.getElementById('readerDeleteStatus');
  if(button) button.disabled = true;
  if(status) status.textContent = 'Deleting your account…';
  try{
    const response = await fetch(SUPABASE_FUNCTIONS_URL + 'delete-reader-account', {
      method:'POST',
      headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},
      body:'{}'
    });
    let payload = {};
    try{ payload = await response.json(); }catch(_error){}
    if(!response.ok) throw new Error(payload.error || 'Your account could not be deleted.');
    clearAuthSession();
    sessionStorage.removeItem('mindovermatter_return_post');
    showToast('Your reader account has been deleted.');
    location.assign('/');
  }catch(error){
    console.error(error);
    if(status) status.textContent = error.message || 'Your account could not be deleted. Please try again.';
    if(button) button.disabled = false;
  }
}

'''
replace_exact('async function loadNewsletterPreferences(){', delete_js + 'async function loadNewsletterPreferences(){', 'reader deletion JS')

# ---------- privacy-light post views ----------
view_js = r'''
function viewedPostIdsThisSession(){
  try{
    const value = JSON.parse(sessionStorage.getItem(POST_VIEW_SESSION_KEY) || '[]');
    return Array.isArray(value) ? value.map(String) : [];
  }catch(_error){
    return [];
  }
}

async function recordPostView(post){
  if(location.protocol === 'file:' || !post?.published || isOwner()) return;
  const id = String(post.id);
  const viewed = viewedPostIdsThisSession();
  if(viewed.includes(id)) return;
  try{
    const result = await supabaseRequest('rpc/increment_post_view', {
      method:'POST',
      body:JSON.stringify({ p_post_id:Number(post.id) })
    });
    const count = Number(result);
    if(Number.isFinite(count)) post.view_count = count;
    sessionStorage.setItem(POST_VIEW_SESSION_KEY, JSON.stringify([...viewed,id]));
  }catch(error){
    console.error('Could not record article view', error);
  }
}

'''
replace_exact('function navigateToPostById(id){', view_js + 'function navigateToPostById(id){', 'post view JS')
replace_exact(
    "  showPage('view-blog-post');\n  document.title = `${p.title} — Mind Over Matter`;",
    "  showPage('view-blog-post');\n  recordPostView(p);\n  document.title = `${p.title} — Mind Over Matter`;",
    'record view on article open',
)

INDEX.write_text(s, encoding='utf-8')

# ---------- privacy policy ----------
privacy = PRIVACY.read_text(encoding='utf-8')
old = '<p>The Site also uses Cloudflare Web Analytics for aggregate readership and performance measurement. Cloudflare describes Web Analytics as privacy-first and cookie-free and states that it does not use cookies or local storage to track visitors for Web Analytics. Cloudflare\'s broader handling of information is described in its <a href="https://www.cloudflare.com/policies/privacy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</p>'
new = old + '\n<p>The Site also maintains a simple per-article view count. When a published essay is opened, the Site increments that essay\'s aggregate counter. The counter does not store an IP address, user identifier, advertising identifier, or browser fingerprint. Session storage is used only to avoid counting repeated opens of the same essay within the same browser session.</p>'
if privacy.count(old) != 1:
    raise SystemExit('privacy analytics paragraph mismatch')
privacy = privacy.replace(old, new, 1)
old = '<p>The Site does not intentionally use advertising cookies or third-party behavioural-advertising trackers. Browser storage is used for functional purposes such as your theme preference, authentication session, navigation state, and—when Stephen is using the private editor—local draft autosave. Cloudflare Web Analytics itself is operated without cookies.</p>'
new = '<p>The Site does not intentionally use advertising cookies or third-party behavioural-advertising trackers. Browser storage is used for functional purposes such as your theme preference, authentication session, navigation state, avoiding duplicate article-view counts within a browser session, and—when Stephen is using the private editor—local draft autosave. Cloudflare Web Analytics itself is operated without cookies.</p>'
if privacy.count(old) != 1:
    raise SystemExit('privacy browser storage paragraph mismatch')
privacy = privacy.replace(old, new, 1)
old = '<p>Subject to applicable legal exceptions and identity verification, you may request access to personal information about you under my control or ask that inaccurate or incomplete information be corrected. You may also request deletion of your reader account by emailing <a href="mailto:hello@stephenleynard.com">hello@stephenleynard.com</a>.</p>\n<p>Some information may need to be retained where permitted or required for security, fraud prevention, legal compliance, backup integrity, or record-keeping. Public comments or other submitted content may require separate review when deletion would affect records involving other users.</p>'
new = '<p>Subject to applicable legal exceptions and identity verification, you may request access to personal information about you under my control or ask that inaccurate or incomplete information be corrected. Signed-in readers can permanently delete their own reader account directly from <strong>My Reader Account</strong>. You may also contact <a href="mailto:hello@stephenleynard.com">hello@stephenleynard.com</a> for an account-deletion or privacy request.</p>\n<p>Self-service account deletion removes the active reader profile, comments, likes, newsletter-subscription/preferences record, and Supabase authentication account associated with that reader. The action is permanent and signs the reader out. Limited information may still be retained where permitted or required for security, fraud prevention, legal compliance, backup integrity, or record-keeping, and residual copies may persist temporarily in routine provider backups until they are overwritten or expire.</p>'
if privacy.count(old) != 1:
    raise SystemExit('privacy deletion section mismatch')
privacy = privacy.replace(old, new, 1)
PRIVACY.write_text(privacy, encoding='utf-8')

# ---------- terms ----------
terms = TERMS.read_text(encoding='utf-8')
old = '<p>Do not post confidential health information, personal information about another person, or information you do not want made public. Display names, comments, and similar community activity may be publicly visible.</p>'
new = old + '<p>Signed-in readers may permanently delete their own reader account through My Reader Account. Account deletion is irreversible and removes the active account and associated Site records as described in the <a href="/privacy">Privacy Policy</a>, subject to lawful or technically necessary retention described there.</p>'
if terms.count(old) != 1:
    raise SystemExit('terms account section mismatch')
terms = terms.replace(old, new, 1)
TERMS.write_text(terms, encoding='utf-8')

print('Final site patch applied successfully.')
