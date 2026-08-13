
stephenleynard.com

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Stephen Leynard — Notes on the Mind</title>
<meta name="description" content="A psychology blog by Stephen Leynard — plain-language notes on how people think, feel, and behave.">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<header class="site-header">
  <div class="notebook">
    <a href="index.html" class="wordmark">Stephen Leynard<span>.</span></a>
    <nav class="site-nav" aria-label="Primary">
      <a href="index.html" aria-current="page">Home</a>
      <a href="index.html#blog">Blog</a>
      <a href="index.html#about">About</a>
      <a href="index.html#contact">Contact</a>
    </nav>
  </div>
</header>

<main>
  <div class="notebook">

    <section class="hero" id="about">
      <span class="tab">Intro</span>
      <p class="eyebrow">Psychology, plainly explained</p>
      <h1>Notes on why people think, feel, and act the <em>way they do</em>.</h1>
      <div class="hero-lede">
        <p>I'm Stephen Leynard. This is a working notebook of ideas from psychology — the kind that explain a bad night's sleep, a decision you can't stop replaying, or why a habit sticks around long after it stops helping.</p>
        <p>No jargon for its own sake, and no claims that outrun the evidence. Just clear, honest writing about the research that actually helps people understand themselves a little better.</p>
      </div>
      <div class="credentials">
        <span class="credential">Cognitive &amp; behavioral psychology</span>
        <span class="credential">Evidence-based</span>
        <span class="credential">New entries monthly</span>
      </div>
    </section>

    <section id="blog">
      <span class="tab">Field notes</span>
      <div class="section-heading">
        <h2>Field notes</h2>
        <span class="section-note">Recent entries</span>
      </div>

      <div class="entry-list">

        <article class="entry">
          <div class="entry-date">Aug&nbsp;10, 2026</div>
          <div class="entry-body">
            <h3><a href="posts/why-we-procrastinate.html">Why we procrastinate on the things we care about most</a></h3>
            <p class="entry-excerpt">Procrastination isn't a time-management problem — it's an emotion-management problem. A look at what the delay is actually protecting you from.</p>
            <div class="entry-meta">
              <span class="tag">Motivation</span>
              <span class="tag">Behavior</span>
              <a class="read-link" href="posts/why-we-procrastinate.html">Read entry</a>
            </div>
          </div>
        </article>

        <article class="entry">
          <div class="entry-date">Jul&nbsp;22, 2026</div>
          <div class="entry-body">
            <h3><a href="posts/the-comparison-trap.html">The comparison trap: what social comparison theory actually predicts</a></h3>
            <p class="entry-excerpt">Comparing yourself to others isn't a character flaw — it's a built-in way we measure ourselves. The trouble starts with what we compare against.</p>
            <div class="entry-meta">
              <span class="tag">Social psychology</span>
              <span class="tag">Self-esteem</span>
              <a class="read-link" href="posts/the-comparison-trap.html">Read entry</a>
            </div>
          </div>
        </article>

        <article class="entry is-draft">
          <div class="entry-date">Coming soon</div>
          <div class="entry-body">
            <h3>How memory actually works (and why it fails you)</h3>
            <p class="entry-excerpt">A plain-language walkthrough of encoding, storage, and retrieval — and why "I remember it clearly" is one of the least reliable sentences in psychology.</p>
            <div class="entry-meta">
              <span class="tag status">In progress</span>
              <span class="tag">Memory</span>
            </div>
          </div>
        </article>

      </div>

      <div class="margin-note">
        New entries are added roughly once a month — this is a notebook, not a newsfeed.
      </div>
    </section>

    <section id="contact">
      <span class="tab">Contact</span>
      <div class="section-heading">
        <h2>Get in touch</h2>
      </div>
      <div class="about-grid">
        <p>Questions, corrections, or a topic you'd like covered — I read everything that comes in.</p>
      </div>
      <ul class="contact-list">
        <li><a href="mailto:hello@stephenleynard.com">hello@stephenleynard.com</a></li>
        <li><a href="https://twitter.com/">Twitter / X</a></li>
        <li><a href="https://linkedin.com/">LinkedIn</a></li>
      </ul>
    </section>

  </div>
</main>

<footer class="site-footer">
  <div class="footer-inner">
    <span>© 2026 Stephen Leynard</span>
    <span>Notes on the Mind — a psychology blog</span>
  </div>
</footer>

</body>
</html>

# Stephen Leynard — Notes on the Mind

A simple, static psychology blog. No build step, no framework — just HTML, CSS, and a `CNAME` file. Built to run on GitHub Pages under a custom domain.

## Files

```
index.html                     Homepage: intro section + blog listing
styles.css                     All styling (one shared stylesheet)
CNAME                          Tells GitHub Pages to serve this at stephenleynard.com
posts/why-we-procrastinate.html   Sample blog post
posts/the-comparison-trap.html    Sample blog post
```

## 1. Put this on GitHub Pages

1. Create a new **public** GitHub repository. If you want it at a `github.io` address, name the repo exactly `<your-username>.github.io` — for any other name, GitHub Pages serves it at `<your-username>.github.io/<repo-name>` instead.
2. Upload all the files in this folder to the root of that repository (keep the `posts/` folder as a subfolder).
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`. Save.
5. Wait a minute or two — GitHub will give you a live URL like `https://<your-username>.github.io`.

## 2. Point your domain (stephenleynard.com) at it

Since you already own the domain, go to your domain registrar's DNS settings and add these records:

**For the root domain (`stephenleynard.com`):** add four `A` records pointing to GitHub's IP addresses:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**For `www.stephenleynard.com` (optional but recommended):** add a `CNAME` record:
```
www   →   <your-username>.github.io
```

DNS changes can take anywhere from a few minutes to 24 hours to propagate.

Back in **Settings → Pages** on GitHub, enter `stephenleynard.com` in the **Custom domain** field and save — this is what writes the `CNAME` file in your repo (it's already included here, so this step should just confirm it). Once DNS resolves, tick **Enforce HTTPS**.

## 3. Add a new blog post

1. Duplicate `posts/why-we-procrastinate.html` and rename it, e.g. `posts/my-new-post.html`.
2. Update the `<title>`, the `eyebrow` (category), the `<h1>`, the date/read-time, and the body text between `<article class="post-body">` and `</article>`.
3. Open `index.html` and add a new `<article class="entry">` block at the top of `.entry-list` (copy an existing one as a template), linking to your new file and pointing to `posts/my-new-post.html`.
4. Commit and push — GitHub Pages redeploys automatically, usually within a minute.

## Design notes

The layout uses a "field notebook" motif: a dotted binding rule down the left edge of the page with small rotated tabs marking each section (Intro, Field notes, Contact), an ochre accent for anything worth noticing, and a serif/mono pairing (Newsreader + JetBrains Mono) that reads like handwritten case notes rather than a marketing page. All of this lives in `styles.css` — change the CSS custom properties at the top of the file (`--paper`, `--ink`, `--ochre`, etc.) to adjust the palette globally.

/* ==========================================================================
   Stephen Leynard — Notes on the Mind
   Design system: "field notebook" — a psychologist's working notes,
   not a marketing page. Warm parchment paper, a binding rule down the
   page, ink-blue headings, ochre for things worth noticing.
   ========================================================================== */

@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Public+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --paper: #f0eee4;
  --paper-alt: #e7e3d4;
  --paper-deep: #ddd8c4;
  --ink: #23241f;
  --ink-soft: #55564c;
  --indigo: #33415c;
  --indigo-soft: #55647f;
  --ochre: #a8763e;
  --sage: #57654f;
  --rule: #c9c4b0;
  --rule-strong: #a9a38a;

  --font-display: 'Newsreader', Georgia, serif;
  --font-body: 'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, Menlo, monospace;

  --measure: 42rem;
  --binding: 3.25rem;
}

* { box-sizing: border-box; }

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--indigo);
  text-decoration-color: var(--rule-strong);
  text-underline-offset: 3px;
}
a:hover { color: var(--ochre); }

a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--ochre);
  outline-offset: 3px;
}

img { max-width: 100%; display: block; }

/* ---- notebook binding: a rule down the left edge of the whole page,
   with small rotated section tabs marking where each part begins ---- */

.notebook {
  position: relative;
  max-width: 62rem;
  margin: 0 auto;
  padding-left: var(--binding);
}

.notebook::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(var(--binding) - 1px);
  width: 1px;
  background: repeating-linear-gradient(
    to bottom,
    var(--rule-strong) 0,
    var(--rule-strong) 6px,
    transparent 6px,
    transparent 12px
  );
}

.tab {
  position: absolute;
  left: 0;
  width: var(--binding);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.85rem;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.14em;
  color: var(--ink-soft);
  text-transform: uppercase;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  top: 2.4rem;
}

/* ---- top bar ---- */

.site-header {
  padding: 1.75rem 1.5rem 0;
}

.site-header .notebook {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-top: 0.25rem;
  padding-bottom: 1.5rem;
}

.wordmark {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--ink);
  text-decoration: none;
  letter-spacing: -0.01em;
}
.wordmark span { color: var(--ochre); }
.wordmark:hover { color: var(--ink); }

.site-nav {
  display: flex;
  gap: 1.75rem;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
}
.site-nav a {
  color: var(--ink-soft);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  padding-bottom: 2px;
}
.site-nav a:hover,
.site-nav a[aria-current="page"] {
  color: var(--indigo);
  border-bottom-color: var(--ochre);
}

/* ---- hero / intro ---- */

main { padding: 0 1.5rem; }

.hero {
  position: relative;
  padding: 2.75rem 0 4rem;
  border-bottom: 1px solid var(--rule);
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  color: var(--ochre);
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.1rem;
}
.eyebrow::before {
  content: "";
  width: 1.4rem;
  height: 1px;
  background: var(--ochre);
}

.hero h1 {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(2.1rem, 4.6vw, 3.15rem);
  line-height: 1.12;
  letter-spacing: -0.01em;
  color: var(--ink);
  margin: 0 0 1.4rem;
  max-width: 30ch;
}
.hero h1 em {
  font-style: italic;
  color: var(--indigo);
}

.hero-lede {
  max-width: var(--measure);
  font-size: 1.14rem;
  color: var(--ink-soft);
}
.hero-lede p { margin: 0 0 1rem; }
.hero-lede p:last-child { margin-bottom: 0; }

.credentials {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem 0.9rem;
}
.credential {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.03em;
  color: var(--sage);
  background: var(--paper-alt);
  border: 1px solid var(--rule);
  padding: 0.3rem 0.6rem;
  border-radius: 3px;
}

/* ---- section heading pattern (used by blog + about) ---- */

.section-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin: 3.25rem 0 1.75rem;
  flex-wrap: wrap;
}
.section-heading h2 {
  font-family: var(--font-display);
  font-size: 1.7rem;
  font-weight: 500;
  margin: 0;
  color: var(--ink);
}
.section-heading .section-note {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--ink-soft);
  letter-spacing: 0.02em;
}

/* ---- blog entries ---- */

.entry-list {
  border-top: 1px solid var(--rule);
}

.entry {
  display: grid;
  grid-template-columns: 8.5rem 1fr;
  gap: 1.5rem;
  padding: 1.9rem 0;
  border-bottom: 1px solid var(--rule);
}

.entry-date {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--ink-soft);
  padding-top: 0.3rem;
}

.entry-body h3 {
  margin: 0 0 0.5rem;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 500;
}
.entry-body h3 a {
  color: var(--ink);
  text-decoration: none;
}
.entry-body h3 a:hover { color: var(--ochre); }

.entry-excerpt {
  margin: 0 0 0.9rem;
  color: var(--ink-soft);
  max-width: 56ch;
}

.entry-meta {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.tag {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--sage);
  background: var(--paper-alt);
  border: 1px solid var(--rule);
  padding: 0.22rem 0.5rem;
  border-radius: 3px;
}

.read-link {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  text-decoration: none;
  color: var(--indigo);
}
.read-link::after { content: " →"; }
.read-link:hover { color: var(--ochre); }

.entry.is-draft {
  opacity: 0.7;
}
.entry.is-draft .tag.status { color: var(--ink-soft); }

/* ---- margin note (signature accent, used sparingly) ---- */

.margin-note {
  margin: 2.5rem 0;
  padding: 1.1rem 1.3rem;
  background: var(--paper-alt);
  border-left: 2px solid var(--ochre);
  max-width: var(--measure);
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.05rem;
  color: var(--ink-soft);
}

/* ---- about / contact ---- */

.about-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  max-width: var(--measure);
  color: var(--ink-soft);
}
.about-grid p { margin: 0 0 1rem; }

.contact-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.75rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
}
.contact-list a { text-decoration: none; }

/* ---- footer ---- */

.site-footer {
  margin-top: 4rem;
  border-top: 1px solid var(--rule);
  padding: 1.75rem 1.5rem 3rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--ink-soft);
}
.footer-inner {
  max-width: 62rem;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

/* ---- single post page ---- */

.post-header {
  padding: 2.75rem 0 2rem;
  border-bottom: 1px solid var(--rule);
}
.post-header .eyebrow { margin-bottom: 1.2rem; }
.post-header h1 {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(1.9rem, 4vw, 2.65rem);
  line-height: 1.18;
  margin: 0 0 1rem;
  max-width: 26ch;
}
.post-meta {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--ink-soft);
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.post-body {
  max-width: var(--measure);
  padding: 2.5rem 0 1rem;
  font-size: 1.08rem;
}
.post-body p { margin: 0 0 1.3rem; }
.post-body h2 {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 1.5rem;
  margin: 2.2rem 0 1rem;
  color: var(--ink);
}
.post-body blockquote {
  margin: 1.8rem 0;
  padding-left: 1.2rem;
  border-left: 2px solid var(--ochre);
  font-style: italic;
  color: var(--ink-soft);
}

.back-link {
  display: inline-block;
  margin-top: 1rem;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  text-decoration: none;
  color: var(--indigo);
}
.back-link::before { content: "← "; }

/* ---- responsive ---- */

@media (max-width: 640px) {
  :root { --binding: 2.1rem; }
  .site-header .notebook { flex-direction: column; align-items: flex-start; gap: 0.9rem; }
  .site-nav { gap: 1.1rem; }
  .entry { grid-template-columns: 1fr; gap: 0.4rem; }
  .entry-date { padding-top: 0; }
  .site-footer { flex-direction: column; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The comparison trap — Stephen Leynard</title>
<meta name="description" content="Comparing yourself to others isn't a character flaw — it's a built-in way we measure ourselves.">
<link rel="stylesheet" href="../styles.css">
</head>
<body>

<header class="site-header">
  <div class="notebook">
    <a href="../index.html" class="wordmark">Stephen Leynard<span>.</span></a>
    <nav class="site-nav" aria-label="Primary">
      <a href="../index.html">Home</a>
      <a href="../index.html#blog">Blog</a>
      <a href="../index.html#about">About</a>
      <a href="../index.html#contact">Contact</a>
    </nav>
  </div>
</header>

<main>
  <div class="notebook">

    <header class="post-header">
      <span class="tab">Entry</span>
      <p class="eyebrow">Social psychology · Self-esteem</p>
      <h1>The comparison trap: what social comparison theory actually predicts</h1>
      <div class="post-meta">
        <span>Jul 22, 2026</span>
        <span>5 min read</span>
      </div>
    </header>

    <article class="post-body">
      <p>In 1954, the psychologist Leon Festinger proposed something that still holds up: in the absence of an objective way to measure ourselves, we measure ourselves against other people. There's no built-in ruler for "how well is my career going" or "how good is my marriage," so we borrow one — usually from whoever happens to be nearby.</p>

      <p>This isn't a flaw to be trained out of yourself. It's a basic feature of how self-evaluation works. The useful question isn't "how do I stop comparing," which rarely succeeds, but "what am I comparing against, and is it a fair measure."</p>

      <h2>Upward, downward, and why the internet breaks the ratio</h2>
      <p>Comparison theory distinguishes between upward comparisons (against people doing better than you) and downward comparisons (against people doing worse). In ordinary life, both happen, and they roughly balance — you're reminded of your progress as often as your gaps.</p>

      <p>Social media disrupts that balance badly. What you see is a curated upward slice: people's best days, best angles, best outcomes, stripped of the ordinary friction that fills most of anyone's actual life. You're not comparing your whole life to their whole life. You're comparing your whole life to their highlight reel — and the ratio that used to balance itself no longer does.</p>

      <blockquote>You are comparing your behind-the-scenes to everyone else's highlight reel.</blockquote>

      <h2>A more accurate comparison</h2>
      <p>Two adjustments tend to help. First, compare yourself to yourself six months ago, not to a stranger at an unknown stage of an unknown life — this restores a fair baseline. Second, when you notice an upward comparison forming, ask what specifically you're reacting to. Often it's not the outcome itself but a signal about what you want more of, which is far more useful to act on than the vague, deflating feeling of "everyone else has it figured out."</p>

      <p>Comparison isn't going away, and it doesn't need to. It just needs a fairer target.</p>
    </article>

    <a class="back-link" href="../index.html#blog">Back to all entries</a>

  </div>
</main>

<footer class="site-footer">
  <div class="footer-inner">
    <span>© 2026 Stephen Leynard</span>
    <span>Notes on the Mind — a psychology blog</span>
  </div>
</footer>

</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Why we procrastinate on the things we care about most — Stephen Leynard</title>
<meta name="description" content="Procrastination isn't a time-management problem — it's an emotion-management problem.">
<link rel="stylesheet" href="../styles.css">
</head>
<body>

<header class="site-header">
  <div class="notebook">
    <a href="../index.html" class="wordmark">Stephen Leynard<span>.</span></a>
    <nav class="site-nav" aria-label="Primary">
      <a href="../index.html">Home</a>
      <a href="../index.html#blog">Blog</a>
      <a href="../index.html#about">About</a>
      <a href="../index.html#contact">Contact</a>
    </nav>
  </div>
</header>

<main>
  <div class="notebook">

    <header class="post-header">
      <span class="tab">Entry</span>
      <p class="eyebrow">Motivation · Behavior</p>
      <h1>Why we procrastinate on the things we care about most</h1>
      <div class="post-meta">
        <span>Aug 10, 2026</span>
        <span>6 min read</span>
      </div>
    </header>

    <article class="post-body">
      <p>Ask someone why they're procrastinating and they'll usually blame their calendar: too little time, too many distractions, a to-do list that never shrinks. But the research tells a different story. Procrastination isn't primarily a scheduling failure — it's a way of managing how a task makes us feel.</p>

      <p>The task you're avoiding right now probably isn't boring. It's the opposite: it matters. And that's exactly why it's uncomfortable. A task that's tied to your competence, your identity, or your future carries a small emotional risk every time you sit down with it — the risk of finding out it's harder than you hoped, or that your first attempt isn't good.</p>

      <h2>The short-term trade</h2>
      <p>Every time you close the tab and open something easier instead, your brain gets an immediate reward: the discomfort disappears. That relief is real, and it's fast — much faster than the slower, uncertain reward of eventually finishing the thing you were avoiding. Behaviorally, this is a simple mismatch. The brain is very good at optimizing for the next few minutes and comparatively bad at weighing a benefit that's a week away.</p>

      <p>This is also why willpower alone rarely fixes procrastination. Telling yourself to "just start" doesn't change the underlying trade your brain is making. What tends to work instead is changing the trade itself.</p>

      <blockquote>The task isn't the problem. The feeling that shows up right before the task is.</blockquote>

      <h2>What actually helps</h2>
      <p>A few approaches with real support behind them:</p>
      <p><strong>Shrink the entry point.</strong> Commit to two minutes, not the whole task. Most of the resistance lives in the transition, not the work itself — once you're in motion, continuing is far easier than starting.</p>
      <p><strong>Name the feeling, not the task.</strong> Instead of "I need to write the report," try "I'm putting this off because I'm worried it won't be good enough." Naming the actual obstacle makes it easier to address directly, rather than fighting a vague sense of resistance.</p>
      <p><strong>Make the future reward feel closer.</strong> Vague, distant payoffs lose every time to an immediate scroll. Picture the specific relief of having it done tonight, not the abstract idea of "being productive."</p>

      <p>None of this makes the discomfort disappear entirely — and it shouldn't. The goal isn't to feel nothing before starting something that matters. It's to stop mistaking that feeling for a reason to wait.</p>
    </article>

    <a class="back-link" href="../index.html#blog">Back to all entries</a>

  </div>
</main>

<footer class="site-footer">
  <div class="footer-inner">
    <span>© 2026 Stephen Leynard</span>
    <span>Notes on the Mind — a psychology blog</span>
  </div>
</footer>

</body>
</html>
