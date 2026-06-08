# Interactive Website

This folder contains a dependency-free static website for the AgentWorks Academy Workshop Kit.

Open locally:

```bash
python -m http.server 8000 -d docs
```

Then visit:

```text
http://localhost:8000
```

Why this lives in the same repo:

- The site is the beginner-friendly front door.
- The markdown files remain the durable workshop library.
- GitHub Pages can publish this folder without a separate deployment project.
- Keeping the site and kit together prevents the website from drifting away from the actual materials.

Suggested GitHub Pages setting:

```text
Settings -> Pages -> Deploy from branch -> main -> /docs
```
