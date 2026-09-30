# Pocket Runner

A way to code from your phone with just a browser: Claude chat writes the code into this repo,
GitHub Actions runs Python for free, and GitHub Pages hosts a runner page for HTML/JS/Python.

```
Claude chat (phone) ──commits──▶ GitHub repo ──push──▶ Actions: run changed .py → outputs/*.log
                                                                └▶ deploy to GitHub Pages
                                     you (phone browser) ◀── https://<you>.github.io/<repo>/
```

## Setup (one time, about 5 minutes)
1. Create a **public** repo on GitHub (Actions and Pages are free for public repos) and push these files to `main`.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Repo **Settings → Actions → General → Workflow permissions: Read and write**.
4. Go to the **Actions** tab. The first run deploys the site. Open `https://<you>.github.io/<repo>/`
   and add it to your home screen.

## Connect Claude
Give Claude write access to the repo (see "Giving Claude write access" below), then start chats with:

> Read CLAUDE.md in <you>/<repo> and follow it. Build me a …

Or paste the contents of `CLAUDE.md` into a Claude **Project**'s instructions so every chat already knows the rules.

## The runner page
- **Files**: every project under `projects/`. Tap one to open it.
- **Run**: HTML shows in a frame (with "Open ↗" for full screen). Python runs in the browser (Pyodide: numpy,
  pandas and matplotlib work). JS runs with a console. **Actions log** shows the real CPython output from the workflow.
- **Paste**: paste a code block straight from chat and run it, no commit needed.
- **⚙**: Live mode reads from the GitHub API, so you see new commits before Pages finishes deploying.

## Giving Claude write access
The built-in GitHub integration in claude.ai can *read* repos but may not be able to commit. Ways to let Claude write:
- **GitHub's MCP server** added as a custom connector (Settings → Connectors → Add custom connector,
  URL `https://api.githubcopilot.com/mcp/`), if your plan supports custom connectors.
- **Claude Code on the web** (claude.ai/code, works in a mobile browser) can work in the repo directly and push.
  It's included with paid plans.
- No write access? Use the **Paste** tab.
