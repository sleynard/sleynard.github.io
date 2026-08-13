<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mind Over Matter — Stephen Leynard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,450;0,9..144,600;0,9..144,700;1,9..144,450;1,9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>

  /* ============================================================
     TOKENS — all colors, type, and spacing live here.
     Black & gold, editorial psychology-practice register.
     ============================================================ */
  :root{
    --bg:            #0C0B09;   /* page background — near black */
    --bg-deep:       #060605;   /* deepest recess / hero gradients */
    --panel:         #17150F;   /* raised cards */
    --panel-raise:   #1D1A13;   /* hover / lighter panel */
    --ink:           #EFE9D8;   /* primary text — warm off-white */
    --ink-soft:      #B3AA95;   /* secondary text */
    --ink-faint:     #726A57;   /* tertiary / placeholder */
    --rule:          #2A2619;   /* hairlines & borders */
    --gold:          #C9A227;   /* primary accent */
    --gold-dk:       #A6841E;   /* accent hover/active */
    --gold-15:       rgba(201,162,39,0.14);
    --gold-soft:     #E4C55E;   /* lighter gold for text-on-dark accents */
    --status-pub:    #C9A227;   /* published */
    --status-pub-15: rgba(201,162,39,0.15);
    --status-draft:  #9B9280;   /* draft */
    --status-draft-15: rgba(155,146,128,0.14);
    --danger:        #B4463B;   /* delete */
    --danger-15:     rgba(180,70,59,0.16);

    --font-display: 'Fraunces', Georgia, serif;
    --font-body:    'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

    --nav-h: 64px;
    --radius: 3px;
    --shadow-card: 0 1px 2px rgba(0,0,0,0.35), 0 10px 28px rgba(0,0,0,0.4);
    --shadow-pop:  0 16px 48px rgba(0,0,0,0.6);
  }

  *{ box-sizing: border-box; }
  html,body{ height:100%; }
  body{
    margin:0;
    background:var(--bg);
    color:var(--ink);
    font-family:var(--font-body);
    -webkit-font-smoothing:antialiased;
    min-height:100vh;
  }
  a{ color:inherit; text-decoration:none; }
  button{ font-family:inherit; cursor:pointer; }
  input,textarea{ font-family:inherit; }
  ::selection{ background:var(--gold-15); color:var(--gold-soft); }

  /* ============================================================
     FIXED TOP NAV — always above content, content never overlaps
     ============================================================ */
  .topnav{
    position:fixed; top:0; left:0; right:0; height:var(--nav-h);
    z-index:500;
    display:flex; align-items:center; justify-content:space-between;
    padding:0 28px;
    background:var(--bg-deep);
    border-bottom:1px solid var(--rule);
  }
  .topnav .brand{
    display:flex; align-items:baseline; gap:9px;
    font-family:var(--font-display);
    font-weight:600; font-style:italic; font-size:20px; letter-spacing:0.2px;
    cursor:pointer;
  }
  .topnav .brand .mark{ color:var(--gold); }
  .topnav .brand .byline{
    font-family:var(--font-body); font-style:normal;
    font-size:10.5px; color:var(--ink-faint);
    letter-spacing:0.08em; text-transform:uppercase;
    border-left:1px solid var(--rule); padding-left:9px; margin-left:1px;
  }
  .nav-actions{ display:flex; align-items:center; gap:8px; }
  .nav-btn{
    border:1px solid var(--rule);
    background:transparent;
    color:var(--ink-soft);
    padding:9px 16px;
    border-radius:var(--radius);
    font-size:13.5px; font-weight:600;
    letter-spacing:0.01em;
    transition:all .15s ease;
  }
  .nav-btn:hover{ border-color:var(--gold); color:var(--gold-soft); }
  .nav-btn.active{
    background:var(--gold); color:#151208; border-color:var(--gold);
  }
  .nav-btn.active:hover{ color:#151208; }
  .nav-btn.ghost-danger{ color:var(--danger); }
  .nav-btn.ghost-danger:hover{ border-color:var(--danger); color:var(--danger); }

  /* page wrapper sits below fixed nav */
  .page{
    padding-top:var(--nav-h);
    min-height:100vh;
    display:none;
  }
  .page.visible{ display:block; }

  /* ============================================================
     SHARED UI BITS
     ============================================================ */
  .eyebrow{
    font-size:11.5px; letter-spacing:0.16em; text-transform:uppercase;
    color:var(--gold); font-weight:700;
  }
  .badge{
    display:inline-flex; align-items:center; gap:5px;
    font-size:11.5px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase;
    padding:4px 10px; border-radius:100px;
  }
  .badge.published{ background:var(--status-pub-15); color:var(--status-pub); }
  .badge.draft{ background:var(--status-draft-15); color:var(--status-draft); }
  .badge::before{ content:''; width:6px; height:6px; border-radius:50%; background:currentColor; }

  .btn{
    border-radius:var(--radius); border:1px solid transparent;
    padding:10px 18px; font-weight:600; font-size:13.5px;
    transition:all .15s ease; display:inline-flex; align-items:center; gap:6px;
  }
  .btn-primary{ background:var(--gold); color:#151208; }
  .btn-primary:hover{ background:var(--gold-dk); }
  .btn-outline{ background:transparent; border-color:var(--rule); color:var(--ink); }
  .btn-outline:hover{ border-color:var(--gold); color:var(--gold-soft); background:var(--panel-raise); }
  .btn-text{ background:none; color:var(--ink-soft); padding:6px 4px; font-size:13px; }
  .btn-text:hover{ color:var(--gold-soft); }
  .btn-icon{
    background:none; border:1px solid var(--rule); border-radius:var(--radius);
    width:32px; height:32px; display:inline-flex; align-items:center; justify-content:center;
    color:var(--ink-soft);
  }
  .btn-icon:hover{ border-color:var(--gold); color:var(--gold-soft); }
  .btn-icon.danger:hover{ border-color:var(--danger); color:var(--danger); background:var(--danger-15); }

  /* ============================================================
     LANDING VIEW
     ============================================================ */
  #view-landing .landing-wrap{
    min-height:calc(100vh - var(--nav-h));
    display:flex; align-items:center; justify-content:center;
    padding:60px 24px;
    position:relative;
    background:
      radial-gradient(1100px 520px at 50% -12%, var(--gold-15), transparent 62%),
      var(--bg);
    overflow:hidden;
  }
  #view-landing .landing-wrap::before{
    content:'';
    position:absolute; inset:0;
    background-image:
      linear-gradient(var(--rule) 1px, transparent 1px),
      linear-gradient(90deg, var(--rule) 1px, transparent 1px);
    background-size:64px 64px;
    opacity:0.35;
    mask-image:radial-gradient(700px 500px at 50% 20%, black, transparent 75%);
    pointer-events:none;
  }
  .landing-inner{ position:relative; max-width:640px; text-align:center; }
  .landing-inner .rule{
    width:64px; height:2px; background:var(--gold); margin:0 auto 26px;
  }
  .landing-inner .kicker{
    font-size:12px; letter-spacing:0.22em; text-transform:uppercase;
    color:var(--ink-faint); font-weight:600; margin-bottom:18px;
  }
  .landing-inner h1{
    font-family:var(--font-display); font-style:italic; font-weight:700;
    font-size:clamp(44px, 7vw, 76px); line-height:1.02; margin:0 0 20px;
    color:var(--ink);
  }
  .landing-inner h1 .amp{ color:var(--gold); }
  .landing-inner p.lede{
    font-size:16.5px; line-height:1.7; color:var(--ink-soft);
    max-width:480px; margin:0 auto 36px;
  }
  .landing-actions{ display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-bottom:44px; }
  .landing-actions .btn{ padding:13px 26px; font-size:14px; }
  .landing-meta{
    display:flex; align-items:center; justify-content:center; gap:14px;
    color:var(--ink-faint); font-size:12.5px; letter-spacing:0.03em;
  }
  .landing-meta .dot{ width:3px; height:3px; border-radius:50%; background:var(--ink-faint); }
  .landing-signature{
    margin-top:56px; padding-top:26px; border-top:1px solid var(--rule);
    font-family:var(--font-display); font-style:italic; color:var(--ink-soft); font-size:15px;
  }

  /* ============================================================
     LOGIN VIEW
     ============================================================ */
  #view-login .login-wrap{
    min-height:calc(100vh - var(--nav-h));
    display:flex; align-items:center; justify-content:center;
    padding:40px 20px;
    background:
      radial-gradient(700px 400px at 15% 10%, var(--gold-15), transparent 60%),
      var(--bg);
  }
  .login-card{
    width:100%; max-width:380px;
    background:var(--panel);
    border:1px solid var(--rule);
    border-radius:6px;
    padding:38px 34px 32px;
    box-shadow:var(--shadow-card);
    text-align:center;
  }
  .login-card .lock{
    width:44px;height:44px;border-radius:50%;
    background:var(--gold-15); color:var(--gold);
    display:flex; align-items:center; justify-content:center;
    margin:0 auto 16px;
  }
  .login-card h1{
    font-family:var(--font-display); font-size:24px; margin:0 0 6px;
  }
  .login-card p{ color:var(--ink-soft); font-size:13.5px; margin:0 0 24px; }
  .field{ text-align:left; margin-bottom:16px; }
  .field label{
    display:block; font-size:12px; font-weight:600; letter-spacing:0.03em;
    color:var(--ink-soft); margin-bottom:6px; text-transform:uppercase;
  }
  .field input, .field textarea, .field select{
    width:100%; padding:11px 13px; border:1px solid var(--rule);
    border-radius:var(--radius); background:var(--bg); color:var(--ink);
    font-size:14px; outline:none; transition:border-color .15s;
  }
  .field input::placeholder, .field textarea::placeholder{ color:var(--ink-faint); }
  .field input:focus, .field textarea:focus, .field select:focus{
    border-color:var(--gold); background:var(--panel-raise);
  }
  .field input[type="date"]{ color-scheme:dark; }
  .login-error{
    display:none; background:var(--danger-15); color:#E1897E;
    font-size:13px; font-weight:600; padding:9px 12px; border-radius:var(--radius);
    margin-bottom:16px; text-align:left;
  }
  .login-error.visible{ display:block; }
  .login-card .hint{ margin-top:18px; font-size:11.5px; color:var(--ink-faint); }

  /* ============================================================
     ADMIN DASHBOARD
     ============================================================ */
  .admin-wrap{ max-width:1080px; margin:0 auto; padding:36px 28px 80px; }
  .admin-head{
    display:flex; align-items:flex-end; justify-content:space-between;
    margin-bottom:28px; gap:16px; flex-wrap:wrap;
  }
  .admin-head h1{ font-family:var(--font-display); font-size:32px; margin:4px 0 0; }

  .stats-row{
    display:grid; grid-template-columns:repeat(4,1fr); gap:14px;
    margin-bottom:30px;
  }
  .stat-card{
    background:var(--panel); border:1px solid var(--rule); border-radius:6px;
    padding:18px 20px; box-shadow:var(--shadow-card);
  }
  .stat-card .num{ font-family:var(--font-display); font-size:34px; line-height:1; color:var(--ink); }
  .stat-card .label{
    font-size:11.5px; text-transform:uppercase; letter-spacing:0.07em;
    color:var(--ink-faint); font-weight:700; margin-top:8px;
  }
  .stat-card.accent .num{ color:var(--gold); }

  .table-card{
    background:var(--panel); border:1px solid var(--rule); border-radius:6px;
    box-shadow:var(--shadow-card); overflow:hidden;
  }
  .table-toolbar{
    display:flex; align-items:center; justify-content:space-between;
    padding:16px 20px; border-bottom:1px solid var(--rule); flex-wrap:wrap; gap:12px;
  }
  .tabs{ display:flex; gap:4px; background:var(--bg); padding:4px; border-radius:8px; }
  .tab{
    border:none; background:transparent; padding:7px 14px; border-radius:6px;
    font-size:13px; font-weight:600; color:var(--ink-soft);
  }
  .tab.active{ background:var(--panel-raise); color:var(--gold-soft); box-shadow:0 1px 2px rgba(0,0,0,0.3); }

  table{ width:100%; border-collapse:collapse; }
  thead th{
    text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:0.06em;
    color:var(--ink-faint); font-weight:700; padding:12px 20px; border-bottom:1px solid var(--rule);
  }
  tbody td{ padding:16px 20px; border-bottom:1px solid var(--rule); vertical-align:top; }
  tbody tr:last-child td{ border-bottom:none; }
  tbody tr:hover{ background:var(--panel-raise); }
  .post-title-cell .ptitle{ font-weight:600; font-size:14.5px; margin-bottom:3px; }
  .post-title-cell .pexcerpt{
    font-size:12.5px; color:var(--ink-soft); max-width:360px;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  .date-cell{ font-size:13px; color:var(--ink-soft); white-space:nowrap; }
  .actions-cell{ display:flex; gap:6px; justify-content:flex-end; }
  .empty-row td{ text-align:center; padding:50px 20px; color:var(--ink-faint); font-size:14px; }

  /* ============================================================
     EDITOR
     ============================================================ */
  .editor-wrap{ max-width:760px; margin:0 auto; padding:36px 28px 90px; }
  .editor-card{
    background:var(--panel); border:1px solid var(--rule); border-radius:6px;
    padding:32px; box-shadow:var(--shadow-card);
  }
  .field textarea{ min-height:320px; resize:vertical; line-height:1.6; font-size:15px; }
  .editor-title-input{
    font-family:var(--font-display); font-size:26px !important; font-weight:600;
    padding:12px 14px !important;
  }
  .row-2{ display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .toggle-field{
    display:flex; align-items:center; justify-content:space-between;
    border:1px solid var(--rule); border-radius:var(--radius); padding:12px 14px;
    background:var(--bg);
  }
  .toggle-field .tlabel{ font-size:13px; font-weight:600; }
  .toggle-field .tsub{ font-size:11.5px; color:var(--ink-faint); margin-top:2px; }
  .switch{ position:relative; width:42px; height:24px; flex:none; }
  .switch input{ opacity:0; width:0; height:0; }
  .slider{
    position:absolute; inset:0; background:var(--rule); border-radius:100px;
    transition:.15s; cursor:pointer;
  }
  .slider::before{
    content:''; position:absolute; width:18px; height:18px; left:3px; top:3px;
    background:#EFE9D8; border-radius:50%; transition:.15s;
    box-shadow:0 1px 2px rgba(0,0,0,0.4);
  }
  .switch input:checked + .slider{ background:var(--gold); }
  .switch input:checked + .slider::before{ transform:translateX(18px); background:#151208; }
  .editor-actions{
    display:flex; justify-content:space-between; align-items:center;
    margin-top:24px; padding-top:20px; border-top:1px solid var(--rule);
  }

  /* ============================================================
     PUBLIC BLOG
     ============================================================ */
  .blog-hero{
    background:
      radial-gradient(900px 420px at 85% -10%, var(--gold-15), transparent 60%),
      var(--bg-deep);
    border-bottom:1px solid var(--rule);
    padding:64px 28px 52px;
    text-align:center;
  }
  .blog-hero .rule{
    width:56px; height:2px; background:var(--gold); margin:0 auto 18px;
  }
  .blog-hero h1{
    font-family:var(--font-display); font-weight:700; font-style:italic;
    font-size:clamp(38px, 6vw, 64px); margin:0 0 12px; line-height:1.05;
  }
  .blog-hero p{
    color:var(--ink-soft); font-size:15.5px; max-width:480px; margin:0 auto;
  }
  .blog-wrap{ max-width:760px; margin:0 auto; padding:56px 28px 100px; }
  .post-list{ display:flex; flex-direction:column; }
  .post-card{
    display:block; padding:32px 0; border-bottom:1px solid var(--rule);
  }
  .post-card:first-child{ padding-top:0; }
  .post-card .pdate{
    font-size:11.5px; letter-spacing:0.08em; text-transform:uppercase;
    color:var(--gold); font-weight:700; margin-bottom:10px;
  }
  .post-card h2{
    font-family:var(--font-display); font-size:27px; font-weight:600;
    margin:0 0 10px; transition:color .15s;
  }
  .post-card:hover h2{ color:var(--gold-soft); }
  .post-card .pexcerpt{ color:var(--ink-soft); font-size:15px; line-height:1.65; margin:0 0 12px; }
  .post-card .read-more{
    font-size:13px; font-weight:700; color:var(--ink);
    display:inline-flex; align-items:center; gap:5px;
  }
  .post-card:hover .read-more{ color:var(--gold-soft); }
  .empty-blog{ text-align:center; padding:70px 20px; color:var(--ink-faint); }
  .empty-blog .eyebrow{ display:block; margin-bottom:8px; }

  .post-full{ max-width:680px; margin:0 auto; padding:56px 28px 100px; }
  .post-full .back-link{
    display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:600;
    color:var(--ink-soft); margin-bottom:28px;
  }
  .post-full .back-link:hover{ color:var(--gold-soft); }
  .post-full .pdate{
    font-size:12px; letter-spacing:0.08em; text-transform:uppercase;
    color:var(--gold); font-weight:700; margin-bottom:14px;
  }
  .post-full h1{
    font-family:var(--font-display); font-size:clamp(30px,5vw,44px);
    line-height:1.12; margin:0 0 28px;
  }
  .post-full .body-copy{
    font-size:17px; line-height:1.85; color:#D9D2BF;
  }
  .post-full .body-copy p{ margin:0 0 20px; }

  /* ============================================================
     MODAL (delete confirm)
     ============================================================ */
  .modal-backdrop{
    display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6);
    z-index:900; align-items:center; justify-content:center; padding:20px;
  }
  .modal-backdrop.visible{ display:flex; }
  .modal-card{
    background:var(--panel); border:1px solid var(--rule); border-radius:8px; padding:26px; max-width:360px; width:100%;
    box-shadow:var(--shadow-pop); text-align:center;
  }
  .modal-card h3{ font-family:var(--font-display); font-size:19px; margin:0 0 8px; }
  .modal-card p{ font-size:13.5px; color:var(--ink-soft); margin:0 0 20px; }
  .modal-actions{ display:flex; gap:10px; justify-content:center; }

  /* toast */
  .toast{
    position:fixed; bottom:26px; left:50%; transform:translateX(-50%) translateY(20px);
    background:var(--gold); color:#151208; padding:12px 20px; border-radius:6px;
    font-size:13.5px; font-weight:700; opacity:0; pointer-events:none;
    transition:all .25s ease; z-index:1000; box-shadow:var(--shadow-pop);
  }
  .toast.visible{ opacity:1; transform:translateX(-50%) translateY(0); }

  @media (max-width: 720px){
    .stats-row{ grid-template-columns:1fr 1fr; }
    .row-2{ grid-template-columns:1fr; }
    thead{ display:none; }
    tbody tr{ display:block; padding:14px 0; }
    tbody td{ display:block; padding:4px 20px; border-bottom:none; }
    tbody tr{ border-bottom:1px solid var(--rule); }
    .actions-cell{ justify-content:flex-start; padding-top:8px; }
    .topnav{ padding:0 14px; }
    .topnav .brand .byline{ display:none; }
  }
</style>
</head>
<body>

<!-- ============================================================
     FIXED TOP NAV
     ============================================================ -->
<nav class="topnav">
  <div class="brand" onclick="goHome()"><span class="mark">Mind</span>&nbsp;Over&nbsp;Matter<span class="byline" id="navByline">Stephen Leynard</span></div>
  <div class="nav-actions">
    <button class="nav-btn" id="navHomeBtn" onclick="goHome()">Home</button>
    <button class="nav-btn" id="navBlogBtn" onclick="goPublic()">Blog</button>
    <button class="nav-btn" id="navAdminBtn" onclick="goAdminEntry()">Admin</button>
    <button class="nav-btn ghost-danger" id="navLogoutBtn" style="display:none" onclick="logout()">Log out</button>
  </div>
</nav>

<!-- ============================================================
     LANDING VIEW
     ============================================================ -->
<div class="page" id="view-landing">
  <div class="landing-wrap">
    <div class="landing-inner">
      <div class="kicker">stephenleynard.com</div>
      <div class="rule"></div>
      <h1>Mind <span class="amp">&amp;</span> Matter</h1>
      <p class="lede">Essays on psychology, behavior, and the quiet mechanics of thought — written by Stephen Leynard for anyone trying to understand their own mind a little better.</p>
      <div class="landing-actions">
        <button class="btn btn-primary" onclick="goPublic()">Read the blog</button>
        <button class="btn btn-outline" onclick="goAdminEntry()">Admin login</button>
      </div>
      <div class="landing-meta">
        <span id="landingPostCount">0 essays published</span>
        <span class="dot"></span>
        <span>Updated regularly</span>
      </div>
      <div class="landing-signature">— Stephen Leynard</div>
    </div>
  </div>
</div>

<!-- ============================================================
     LOGIN VIEW
     ============================================================ -->
<div class="page" id="view-login">
  <div class="login-wrap">
    <div class="login-card">
      <div class="lock">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
      </div>
      <h1>Admin access</h1>
      <p>Enter the password to manage posts.</p>
      <div class="login-error" id="loginError">Incorrect password. Try again.</div>
      <form onsubmit="return attemptLogin(event)">
        <div class="field">
          <label for="pw">Password</label>
          <input type="password" id="pw" placeholder="••••••••" autocomplete="off">
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;">Enter dashboard</button>
      </form>
      <div class="hint">Demo password: <strong>admin123</strong></div>
    </div>
  </div>
</div>

<!-- ============================================================
     ADMIN DASHBOARD
     ============================================================ -->
<div class="page" id="view-dashboard">
  <div class="admin-wrap">
    <div class="admin-head">
      <div>
        <div class="eyebrow">Admin dashboard</div>
        <h1>Your posts</h1>
      </div>
      <button class="btn btn-primary" onclick="openEditor(null)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
        New post
      </button>
    </div>

    <div class="stats-row">
      <div class="stat-card"><div class="num" id="statTotal">0</div><div class="label">Total posts</div></div>
      <div class="stat-card accent"><div class="num" id="statPublished">0</div><div class="label">Published</div></div>
      <div class="stat-card"><div class="num" id="statDrafts">0</div><div class="label">Drafts</div></div>
      <div class="stat-card"><div class="num" id="statMonth">0</div><div class="label">This month</div></div>
    </div>

    <div class="table-card">
      <div class="table-toolbar">
        <div class="tabs">
          <button class="tab active" data-filter="all" onclick="setFilter('all')">All</button>
          <button class="tab" data-filter="published" onclick="setFilter('published')">Published</button>
          <button class="tab" data-filter="draft" onclick="setFilter('draft')">Drafts</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width:46%">Post</th>
            <th>Status</th>
            <th>Publish date</th>
            <th style="text-align:right">Actions</th>
          </tr>
        </thead>
        <tbody id="postsTableBody"></tbody>
      </table>
    </div>
  </div>
</div>

<!-- ============================================================
     EDITOR
     ============================================================ -->
<div class="page" id="view-editor">
  <div class="editor-wrap">
    <button class="btn-text" onclick="goDashboard()">&larr; Back to dashboard</button>
    <div class="editor-card" style="margin-top:14px;">
      <div class="eyebrow" id="editorEyebrow">New post</div>
      <div class="field" style="margin-top:14px;">
        <label for="editTitle">Title</label>
        <input type="text" id="editTitle" class="editor-title-input" placeholder="Give your post a title">
      </div>
      <div class="field">
        <label for="editBody">Body</label>
        <textarea id="editBody" placeholder="Write your post. Separate paragraphs with a blank line."></textarea>
      </div>
      <div class="row-2">
        <div class="field" style="margin-bottom:0;">
          <label for="editDate">Publish date</label>
          <input type="date" id="editDate">
        </div>
        <div class="field" style="margin-bottom:0;">
          <label>Status</label>
          <div class="toggle-field">
            <div>
              <div class="tlabel" id="editStatusLabel">Draft</div>
              <div class="tsub">Toggle to publish</div>
            </div>
            <label class="switch">
              <input type="checkbox" id="editPublished" onchange="onEditorToggle()">
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
      <div class="editor-actions">
        <button class="btn-text" style="color:var(--danger)" id="editorDeleteBtn" onclick="requestDelete(currentEditId)">Delete post</button>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-outline" onclick="goDashboard()">Cancel</button>
          <button class="btn btn-primary" onclick="saveEditor()">Save post</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ============================================================
     PUBLIC BLOG — LIST
     ============================================================ -->
<div class="page" id="view-blog-list">
  <div class="blog-hero">
    <div class="rule"></div>
    <h1>Mind Over Matter</h1>
    <p>Essays on psychology and behavior by Stephen Leynard — written plainly, published often.</p>
  </div>
  <div class="blog-wrap">
    <div class="post-list" id="publicPostList"></div>
  </div>
</div>

<!-- ============================================================
     PUBLIC BLOG — SINGLE POST
     ============================================================ -->
<div class="page" id="view-blog-post">
  <div class="post-full" id="publicPostFull"></div>
</div>

<!-- ============================================================
     DELETE CONFIRM MODAL
     ============================================================ -->
<div class="modal-backdrop" id="deleteModal">
  <div class="modal-card">
    <h3>Delete this post?</h3>
    <p>This can't be undone. The post will be permanently removed.</p>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="closeDeleteModal()">Cancel</button>
      <button class="btn btn-primary" style="background:var(--danger); color:#fff;" onclick="confirmDelete()">Delete</button>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
/* ============================================================
   STATE
   ============================================================ */
const STORAGE_KEY = 'mycms_posts_v1';
const AUTH_KEY = 'mycms_authed';
const ADMIN_PASSWORD = 'admin123';

const SAMPLE_POSTS = [
  {
    id: 's1',
    title: 'The stories we tell ourselves under stress',
    excerpt: 'When the mind is under pressure, it reaches for the nearest explanation — and the nearest explanation is rarely the most accurate one.',
    body: `Under stress, the brain stops optimizing for accuracy and starts optimizing for speed. That trade-off made sense for a nervous system built to react to immediate physical threats. It makes considerably less sense when the "threat" is an ambiguous email or a delayed reply.\n\nWhat this means in practice: the story you tell yourself in the first sixty seconds of a stressful moment is usually the least reliable interpretation available to you, precisely because it was generated under the worst conditions for careful thinking.\n\nA simple habit helps more than it should — treat your first read of a stressful situation as a draft, not a conclusion. Write it down, wait an hour, and read it again. Most people find the second read is noticeably calmer than the first, not because the situation changed, but because the nervous system did.`,
    status: 'published',
    date: '2026-08-02'
  },
  {
    id: 's2',
    title: 'Habits are not about willpower',
    excerpt: 'The research is fairly consistent on this point, even though it runs against most of the popular advice: willpower is the least reliable lever you have.',
    body: `Ask most people why a habit failed and they'll tell you they didn't have enough discipline. Ask a behavioral psychologist and you'll get a different answer: the environment made the old behavior easier than the new one.\n\nWillpower is a limited, fluctuating resource — it's depleted by sleep debt, hunger, and unrelated decision-making earlier in the day. Environment, by contrast, doesn't get tired. If the cue for the old behavior is still sitting on the counter, in the app on your home screen, or in the friend group you see every weekend, willpower is fighting a battle it was never built to win consistently.\n\nThe more durable move is almost always structural: change what's easiest to reach for, not how hard you try to resist it.`,
    status: 'published',
    date: '2026-07-18'
  },
  {
    id: 's3',
    title: 'What rumination is actually for',
    excerpt: 'Replaying a conversation for the tenth time isn\'t a malfunction. It\'s a system trying, badly, to finish a job it was never given the right tools for.',
    body: `Rumination gets treated as a symptom to eliminate, and in its chronic form, it often should be addressed. But it's worth understanding what the mechanism is actually trying to do before dismissing it.\n\nReplaying an unresolved social moment is the brain's attempt at threat assessment — it's looking for the piece of information that would let it close the loop and stop monitoring. The problem is that most ruminated-on moments don't contain new information; you're running the same search against the same data and getting the same non-answer.\n\nWhat tends to actually close the loop isn't more replaying, it's new input: a conversation with the other person, a written reframe, or simply enough time for the nervous system to downgrade the threat on its own. Understanding that distinction — search versus resolution — is often the first step toward interrupting the cycle.`,
    status: 'published',
    date: '2026-08-09'
  },
  {
    id: 's4',
    title: 'Draft: on the psychology of procrastination',
    excerpt: 'Some unfinished notes on procrastination as an emotion-regulation strategy rather than a time-management failure.',
    body: `Still working through this one. The short version: procrastination correlates more strongly with mood regulation than with poor scheduling. More to come once the research review is finished.`,
    status: 'draft',
    date: '2026-08-11'
  }
];

function loadPosts(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw){
    try{ return JSON.parse(raw); }catch(e){ /* fall through */ }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_POSTS));
  return SAMPLE_POSTS.slice();
}
function savePosts(posts){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

let posts = loadPosts();
let currentFilter = 'all';
let currentEditId = null;
let pendingDeleteId = null;
let currentPublicPostId = null;

/* ============================================================
   NAV / VIEW ROUTING
   ============================================================ */
function showPage(id){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('visible'));
  document.getElementById(id).classList.add('visible');
  window.scrollTo(0,0);
  syncNavButtons(id);
}

function syncNavButtons(id){
  const isAdminArea = ['view-login','view-dashboard','view-editor'].includes(id);
  const isPublicArea = ['view-blog-list','view-blog-post'].includes(id);
  const isHome = id === 'view-landing';
  document.getElementById('navHomeBtn').classList.toggle('active', isHome);
  document.getElementById('navBlogBtn').classList.toggle('active', isPublicArea);
  document.getElementById('navAdminBtn').classList.toggle('active', isAdminArea && isAuthed());
  document.getElementById('navLogoutBtn').style.display = isAuthed() ? 'inline-flex' : 'none';
}

function isAuthed(){ return sessionStorage.getItem(AUTH_KEY) === '1'; }

function goHome(){
  document.getElementById('landingPostCount').textContent =
    posts.filter(p => p.status === 'published').length + ' essays published';
  showPage('view-landing');
}

function goPublic(){
  currentPublicPostId = null;
  renderPublicList();
  showPage('view-blog-list');
}

function goAdminEntry(){
  if(isAuthed()){
    goDashboard();
  }else{
    document.getElementById('loginError').classList.remove('visible');
    document.getElementById('pw').value = '';
    showPage('view-login');
  }
}

function attemptLogin(e){
  e.preventDefault();
  const val = document.getElementById('pw').value;
  if(val === ADMIN_PASSWORD){
    sessionStorage.setItem(AUTH_KEY, '1');
    goDashboard();
  }else{
    document.getElementById('loginError').classList.add('visible');
  }
  return false;
}

function logout(){
  sessionStorage.removeItem(AUTH_KEY);
  goHome();
  showToast('Logged out');
}

function goDashboard(){
  if(!isAuthed()){ goAdminEntry(); return; }
  renderDashboard();
  showPage('view-dashboard');
}

/* ============================================================
   DASHBOARD RENDER
   ============================================================ */
function setFilter(f){
  currentFilter = f;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.filter === f));
  renderTable();
}

function renderDashboard(){
  renderStats();
  renderTable();
}

function renderStats(){
  const total = posts.length;
  const published = posts.filter(p => p.status === 'published').length;
  const drafts = posts.filter(p => p.status === 'draft').length;
  const now = new Date();
  const thisMonth = posts.filter(p => {
    const d = new Date(p.date + 'T00:00:00');
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
  document.getElementById('statTotal').textContent = total;
  document.getElementById('statPublished').textContent = published;
  document.getElementById('statDrafts').textContent = drafts;
  document.getElementById('statMonth').textContent = thisMonth;
}

function fmtDate(iso){
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}

function renderTable(){
  const body = document.getElementById('postsTableBody');
  let list = posts.slice().sort((a,b) => b.date.localeCompare(a.date));
  if(currentFilter !== 'all'){ list = list.filter(p => p.status === currentFilter); }

  if(list.length === 0){
    body.innerHTML = `<tr class="empty-row"><td colspan="4">No posts here yet.</td></tr>`;
    return;
  }

  body.innerHTML = list.map(p => `
    <tr>
      <td class="post-title-cell">
        <div class="ptitle">${escapeHtml(p.title)}</div>
        <div class="pexcerpt">${escapeHtml(p.excerpt)}</div>
      </td>
      <td><span class="badge ${p.status}">${p.status}</span></td>
      <td class="date-cell">${fmtDate(p.date)}</td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon" title="${p.status === 'published' ? 'Move to draft' : 'Publish'}" onclick="toggleStatus('${p.id}')">
            ${p.status === 'published'
              ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.4 5.5A9.6 9.6 0 0 1 12 5c5 0 9 4.5 10 7-.5 1.2-1.4 2.7-2.7 4M6.2 6.7C4 8.3 2.5 10.4 2 12c1 2.5 5 7 10 7 1.2 0 2.4-.2 3.5-.6"/></svg>'
              : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>'}
          </button>
          <button class="btn-icon" title="Edit" onclick="openEditor('${p.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
          <button class="btn-icon danger" title="Delete" onclick="requestDelete('${p.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function toggleStatus(id){
  const p = posts.find(x => x.id === id);
  if(!p) return;
  p.status = p.status === 'published' ? 'draft' : 'published';
  savePosts(posts);
  renderDashboard();
  showToast(p.status === 'published' ? 'Post published' : 'Moved to draft');
}

/* ============================================================
   DELETE MODAL
   ============================================================ */
function requestDelete(id){
  pendingDeleteId = id;
  document.getElementById('deleteModal').classList.add('visible');
}
function closeDeleteModal(){
  pendingDeleteId = null;
  document.getElementById('deleteModal').classList.remove('visible');
}
function confirmDelete(){
  posts = posts.filter(p => p.id !== pendingDeleteId);
  savePosts(posts);
  closeDeleteModal();
  if(document.getElementById('view-editor').classList.contains('visible')){
    goDashboard();
  }else{
    renderDashboard();
  }
  showToast('Post deleted');
}

/* ============================================================
   EDITOR
   ============================================================ */
function openEditor(id){
  currentEditId = id;
  const isNew = id === null;
  document.getElementById('editorEyebrow').textContent = isNew ? 'New post' : 'Edit post';
  document.getElementById('editorDeleteBtn').style.display = isNew ? 'none' : 'inline-flex';

  if(isNew){
    document.getElementById('editTitle').value = '';
    document.getElementById('editBody').value = '';
    document.getElementById('editDate').value = new Date().toISOString().slice(0,10);
    document.getElementById('editPublished').checked = false;
  }else{
    const p = posts.find(x => x.id === id);
    document.getElementById('editTitle').value = p.title;
    document.getElementById('editBody').value = p.body;
    document.getElementById('editDate').value = p.date;
    document.getElementById('editPublished').checked = p.status === 'published';
  }
  onEditorToggle();
  showPage('view-editor');
}

function onEditorToggle(){
  const checked = document.getElementById('editPublished').checked;
  document.getElementById('editStatusLabel').textContent = checked ? 'Published' : 'Draft';
}

function saveEditor(){
  const title = document.getElementById('editTitle').value.trim();
  const bodyText = document.getElementById('editBody').value.trim();
  const date = document.getElementById('editDate').value || new Date().toISOString().slice(0,10);
  const status = document.getElementById('editPublished').checked ? 'published' : 'draft';

  if(!title){
    showToast('Give the post a title first');
    return;
  }

  const excerpt = bodyText.split('\n').find(l => l.trim().length > 0)?.slice(0,140) || '';

  if(currentEditId === null){
    posts.push({
      id: 'p' + Date.now(),
      title, body: bodyText, excerpt, status, date
    });
  }else{
    const p = posts.find(x => x.id === currentEditId);
    p.title = title; p.body = bodyText; p.excerpt = excerpt; p.status = status; p.date = date;
  }
  savePosts(posts);
  showToast('Post saved');
  goDashboard();
}

/* ============================================================
   PUBLIC BLOG
   ============================================================ */
function renderPublicList(){
  const wrap = document.getElementById('publicPostList');
  const list = posts.filter(p => p.status === 'published').sort((a,b) => b.date.localeCompare(a.date));
  if(list.length === 0){
    wrap.innerHTML = `<div class="empty-blog"><span class="eyebrow">Nothing yet</span>New posts will appear here once published.</div>`;
    return;
  }
  wrap.innerHTML = list.map(p => `
    <a class="post-card" href="javascript:void(0)" onclick="openPublicPost('${p.id}')">
      <div class="pdate">${fmtDate(p.date)}</div>
      <h2>${escapeHtml(p.title)}</h2>
      <p class="pexcerpt">${escapeHtml(p.excerpt)}</p>
      <span class="read-more">Read the essay &rarr;</span>
    </a>
  `).join('');
}

function openPublicPost(id){
  currentPublicPostId = id;
  const p = posts.find(x => x.id === id);
  if(!p) { goPublic(); return; }
  const paragraphs = p.body.split('\n').filter(l => l.trim().length > 0).map(l => `<p>${escapeHtml(l)}</p>`).join('');
  document.getElementById('publicPostFull').innerHTML = `
    <a class="back-link" href="javascript:void(0)" onclick="goPublic()">&larr; All essays</a>
    <div class="pdate">${fmtDate(p.date)}</div>
    <h1>${escapeHtml(p.title)}</h1>
    <div class="body-copy">${paragraphs}</div>
  `;
  showPage('view-blog-post');
}

/* ============================================================
   UTIL
   ============================================================ */
function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

let toastTimer = null;
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('visible'), 2200);
}

/* ============================================================
   INIT
   ============================================================ */
(function init(){
  goHome();
})();
</script>
</body>
</html>
