# Instructions for Claude

This repo is a mobile coding sandbox. The owner codes from Claude chat on their phone and runs the
results at their GitHub Pages site (the "Pocket Runner" page at the repo root).

## Where to put code
- Every project goes in its own folder: `projects/<project-name>/`, in kebab-case.
- Web projects: the entry point is `projects/<name>/index.html`. Separate `.css`/`.js` files are fine.
  Use relative paths like `./style.css`, never root paths like `/style.css`.
- Python: `projects/<name>/main.py`. If you need pip packages, list them in `projects/<name>/requirements.txt`.
- Standalone JS (console output only): `projects/<name>/main.js`.
- Don't edit `index.html` at the repo root, `.github/`, or `outputs/` unless the owner asks.

## How code runs
- **HTML/CSS/JS** is served by GitHub Pages at `https://<owner>.github.io/<repo>/projects/<name>/`,
  about a minute after each push. It's a static site, so there's no backend. Browser APIs and CDN libraries are fine.
- **Python** runs in two places:
  1. **GitHub Actions** (real CPython 3.12 on Linux) runs every `.py` file that changed on each push to `main`.
     stdout/stderr and the exit code go to `outputs/projects/<name>/<file>.log`, committed back to the repo.
     **After pushing Python, wait about 1 minute, then read that log file to check your work and fix any errors.**
     There's a 300s timeout and no stdin, so don't call `input()` in files meant for Actions.
  2. **In the browser** via Pyodide when the owner taps Run. Pure Python, numpy, pandas, matplotlib
     (`plt.show()` shows the plot) and `input()` (as a prompt) work there. No network sockets or threads.
  - Put `# @browser-only` in the first 5 lines of a file to skip the Actions run (for interactive scripts).

## Workflow
1. Write or update the files and commit straight to `main` with a clear message.
2. Tell the owner the project folder name and the link:
   `https://<owner>.github.io/<repo>/projects/<name>/`. They can also open it from the runner's Files tab.
3. For Python, read the Actions log afterwards and report or fix the output.
