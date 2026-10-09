---
name: "Custom domain durable.withtemporal.dev"
description: "Site served at durable.withtemporal.dev; Cloudflare CNAME to GitHub Pages, DNS only, shared zone"
type: project
---

# Custom domain durable.withtemporal.dev

The GitHub Pages site is served at `https://durable.withtemporal.dev`. The
custom domain is set in the repository's Pages settings (deployment by
GitHub Actions, so `output/` carries no `CNAME` file).

The `withtemporal.dev` DNS zone is on Cloudflare and shared with other
services. The site uses two records there:

- `CNAME durable -> alexandreroman.github.io`, **DNS only** (not proxied)
- `TXT _github-pages-challenge-alexandreroman.durable`: GitHub domain
  verification

**Why:** DNS only lets GitHub issue its Let's Encrypt certificate and keeps
the zone-wide SSL/TLS mode out of the picture, so the other services on the
zone are unaffected. The verification record protects the domain from
takeover by another GitHub account.

**How to apply:** change only the `durable` records in the zone; never
proxy them nor edit zone-wide settings. The Cloudflare API is reachable with
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ZONE_ID` from the local, git-ignored
`.env` file. The Pages deployment itself is described in README.md
(Deployment).
