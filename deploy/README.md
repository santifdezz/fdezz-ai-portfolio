# Deploying sfseoane.es

The site runs on the Makineo VPS (`makineo-cmd`, OVH, 178.32.19.240) in
`/opt/portfolio`, as one container next to Makineo's and isolated from it:

| | |
|---|---|
| Container | `portfolio-web` (compose project `portfolio`, `docker-compose.prod.yml`) |
| Listens on | `127.0.0.1:3020` only — never on a public interface |
| Runs as | `node` (non-root), read-only root fs, all capabilities dropped, `no-new-privileges`, 512 MB / 1 CPU |
| Public entry | Makineo's edge nginx (`makineo-edge`, host network, :80/:443) → `deploy/nginx/sfseoane.es.conf` |
| TLS / CDN | Cloudflare proxy (orange cloud), SSL "Full (strict)", Cloudflare Origin CA certificate |

Why Cloudflare in front: the VPS firewall (ufw) only lets Cloudflare's ranges
reach :443, and pointing `sfseoane.es` straight at the VPS would publish the
IP of Makineo's origin. Behind the proxy neither changes.

## Updating the site

```bash
deploy/deploy.sh
```

Runs the tests and lint, syncs the working tree, rebuilds the image on the
server and checks the container answers.

## Going live on sfseoane.es (one-off)

1. **Cloudflare**: add the zone `sfseoane.es` (free plan) in the same account
   as makineo.es. When it imports the records, keep the mail ones —
   `MX 1 mx1.mail.ovh.net`, `MX 5 mx2.mail.ovh.net`, `MX 100 mx3.mail.ovh.net`
   and `TXT "v=spf1 include:mx.ovh.com -all"` (DNS only, grey) — and replace
   the GitHub Pages ones with:
   - `A sfseoane.es → 178.32.19.240`, **proxied**
   - `CNAME www → sfseoane.es`, **proxied**
2. **OVH**: change the domain's nameservers to the two Cloudflare gives you.
3. **Cloudflare → SSL/TLS**: mode *Full (strict)*, *Always Use HTTPS* on,
   minimum TLS 1.2. *Origin Server → Create certificate* for `sfseoane.es` and
   `*.sfseoane.es`, then on the server:
   ```bash
   sudo install -m 644 /dev/stdin /etc/ssl/certs/sfseoane.es.pem     # paste the certificate
   sudo install -m 600 /dev/stdin /etc/ssl/private/sfseoane.es.key   # paste the private key
   ```
4. **nginx** (on the server):
   ```bash
   cp /opt/portfolio/deploy/nginx/sfseoane.es.conf /opt/makineo/mkn_infra/nginx/conf.d/
   docker exec makineo-edge nginx -t && docker exec makineo-edge nginx -s reload
   ```
   That directory is Makineo's repo: commit the file there too.
5. **GitHub Pages**: once Cloudflare serves the site, remove the custom domain
   from the Pages repo (`santifdezz.github.io`: Settings → Pages, and its
   `CNAME` file) so Pages stops claiming it.
6. **Check**: `curl -sI https://sfseoane.es` (200, `strict-transport-security`),
   `https://www.sfseoane.es` → 301, the link preview (`/og-image.png`), and the
   browser console for Content-Security-Policy reports. When there are none,
   change `Content-Security-Policy-Report-Only` to `Content-Security-Policy`
   in the vhost and reload nginx.
