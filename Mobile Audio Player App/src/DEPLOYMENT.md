# Deployment Guide

## Overview

This Progressive Web App can be deployed to any static hosting service. No server-side code is required.

## Recommended Platforms

### 1. Vercel (Recommended)
**Pros:**
- Zero configuration
- Automatic HTTPS
- Global CDN
- Great performance

**Steps:**
1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import project from GitHub
4. Deploy (automatic)

**Configuration:**
```json
// vercel.json (optional)
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### 2. Netlify
**Pros:**
- Simple deployment
- Continuous deployment
- Free tier generous

**Steps:**
1. Visit [netlify.com](https://netlify.com)
2. Drag & drop `dist` folder
3. Or connect GitHub repository

**Configuration:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
```

### 3. GitHub Pages
**Pros:**
- Free for public repos
- Simple setup
- Good for demos

**Steps:**
1. Build project: `npm run build`
2. Install gh-pages: `npm install -D gh-pages`
3. Add to package.json:
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```
4. Run: `npm run deploy`
5. Enable GitHub Pages in repo settings

**Note:** Update base URL in vite.config if needed:
```typescript
export default {
  base: '/repo-name/'
}
```

### 4. Cloudflare Pages
**Pros:**
- Fast global network
- Free tier
- Great performance

**Steps:**
1. Visit [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect GitHub repo
3. Configure build:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy

## PWA Configuration

### 1. Add Web App Manifest

Create `public/manifest.json`:

```json
{
  "name": "Audio Player PWA",
  "short_name": "Player",
  "description": "Progressive Web App Audio Player with Gesture Controls",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 2. Link Manifest in index.html

```html
<head>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#000000">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <link rel="apple-touch-icon" href="/icon-192.png">
</head>
```

### 3. Create App Icons

Generate icons in these sizes:
- 192x192 (required)
- 512x512 (required)
- 180x180 (Apple)
- 32x32 (favicon)

**Tools:**
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)

### 4. Add Service Worker (Optional)

Create `public/sw.js` for offline support:

```javascript
const CACHE_NAME = 'audio-player-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

Register in `index.html`:

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('SW registered'))
      .catch((err) => console.log('SW error:', err));
  }
</script>
```

## Build Process

### Development
```bash
npm install
npm run dev
```
Access at: http://localhost:5173

### Production Build
```bash
npm run build
```
Output: `dist/` directory

### Preview Build
```bash
npm run preview
```
Access at: http://localhost:4173

## Environment Variables

No environment variables needed! Everything runs client-side.

## Custom Domain

### Vercel
1. Go to project settings
2. Add domain under "Domains"
3. Configure DNS:
   - Type: CNAME
   - Name: @
   - Value: cname.vercel-dns.com

### Netlify
1. Go to domain settings
2. Add custom domain
3. Configure DNS:
   - Type: CNAME
   - Name: www
   - Value: [your-site].netlify.app

## HTTPS

All recommended platforms provide automatic HTTPS via Let's Encrypt.

**Important:** PWA features require HTTPS in production.

## Performance Optimization

### 1. Asset Optimization
- Compress images
- Minify CSS/JS (automatic in build)
- Use lazy loading

### 2. CDN Configuration
All recommended platforms include CDN. No additional setup needed.

### 3. Caching Headers
Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 4. Lighthouse Audit
Run before deployment:
```bash
npm install -g @lhci/cli
lhci autorun
```

Target scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- PWA: 100

## Security Headers

Add to hosting configuration:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Vercel:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

## Analytics (Optional)

### Privacy-Friendly Options
- [Plausible](https://plausible.io)
- [Fathom](https://usefathom.com)
- [Simple Analytics](https://simpleanalytics.com)

Add to `index.html`:
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## Monitoring

### Error Tracking
Consider adding:
- [Sentry](https://sentry.io) (comprehensive)
- Browser console only (minimal)

### Uptime Monitoring
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://pingdom.com)

## Mobile App Wrapper (Optional)

Convert to native app using:

### Capacitor (Recommended)
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios
npx cap add android
npm run build
npx cap copy
npx cap open ios
npx cap open android
```

### Benefits
- Access to native APIs
- App store distribution
- Better offline support
- Push notifications

## Rollback Strategy

### Vercel/Netlify
- Every deployment is immutable
- One-click rollback in dashboard
- Maintain deployment history

### Manual Deployment
- Tag releases in Git
- Keep previous `dist` folders
- Document deployment steps

## Deployment Checklist

### Pre-Deployment
- [ ] Run tests: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Preview works: `npm run preview`
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] Test on mobile device
- [ ] Test offline functionality
- [ ] Update version in manifest
- [ ] Update README with live URL

### Post-Deployment
- [ ] Verify live site loads
- [ ] Test core functionality
- [ ] Check HTTPS certificate
- [ ] Test PWA install
- [ ] Verify service worker (if used)
- [ ] Test on multiple devices
- [ ] Check analytics (if enabled)
- [ ] Update documentation

## Continuous Deployment

### GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### PWA Not Installing
- Verify HTTPS
- Check manifest.json syntax
- Verify icons exist
- Check service worker registration
- Use Chrome DevTools > Application > Manifest

### Audio Not Playing
- Check HTTPS (required for some browsers)
- Verify MIME types
- Check CORS headers (if loading from CDN)

### Blank Page After Deploy
- Check base URL in config
- Verify all assets copied
- Check console for 404s
- Verify build output

## Domain Examples

Good domain names:
- `audioplayer.app`
- `myplayer.io`
- `musicplayer.dev`
- `[yourname]-player.com`

## Cost Estimate

### Free Tier (Sufficient for MVP)
- Vercel: Free
- Netlify: Free
- GitHub Pages: Free
- Cloudflare Pages: Free

### Paid Tier (High Traffic)
- Vercel Pro: $20/month
- Netlify Pro: $19/month
- Custom Domain: $10-15/year

## Maintenance

### Regular Tasks
- Monthly dependency updates
- Quarterly security audits
- Monitor error logs
- Review analytics

### Updates
```bash
# Update dependencies
npm outdated
npm update

# Major version updates
npm install react@latest
npm install tailwindcss@latest
```

## Support

### User Support
- Add FAQ section
- Create contact form
- Monitor social media
- GitHub issues for bugs

### Documentation
- Keep README updated
- Document new features
- Version changelog
- API documentation (if added)

---

## Quick Deploy Commands

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### GitHub Pages
```bash
npm run deploy
```

---

**Last Updated:** October 2025  
**Deployment Guide Version:** 1.0
