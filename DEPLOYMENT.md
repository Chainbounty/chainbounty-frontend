# ChainBounty Deployment Guide

This guide covers deploying the ChainBounty frontend to production.

## Prerequisites

- [x] Code is built and tested locally
- [x] All dependencies are installed
- [x] Environment variables are configured
- [x] Domain name registered (optional)

## Deployment Options

### Option 1: Vercel (Recommended)

#### Quick Deploy

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

#### GitHub Integration (Automated)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add environment variables (see below)
7. Click "Deploy"

**Auto-deployment**: Every push to `main` will auto-deploy!

#### Custom Domain Setup

1. Go to your project settings on Vercel
2. Navigate to "Domains"
3. Add your domain (e.g., `chainbounty.com`)
4. Update DNS records:
   - Type: A
   - Name: @
   - Value: 76.76.21.21
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

5. Wait for DNS propagation (up to 48 hours)

### Option 2: Netlify

#### CLI Deploy

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Build**
   ```bash
   npm run build
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

#### GitHub Integration

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables
7. Click "Deploy"

### Option 3: Static Hosting

For any static host (AWS S3, Cloudflare Pages, GitHub Pages):

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder** to your hosting provider

3. **Configure redirects** for SPA routing:
   - All routes should redirect to `/index.html`

## Environment Variables

Set these in your deployment platform:

### Required
```env
VITE_STELLAR_NETWORK=PUBLIC
VITE_STELLAR_HORIZON_URL=https://horizon.stellar.org
VITE_CONTRACT_ID=YOUR_CONTRACT_ID_HERE
```

### Optional
```env
VITE_IPFS_GATEWAY=https://gateway.pinata.cloud
VITE_ANALYTICS_ID=YOUR_ANALYTICS_ID
```

### Vercel
```bash
vercel env add VITE_STELLAR_NETWORK
vercel env add VITE_STELLAR_HORIZON_URL
vercel env add VITE_CONTRACT_ID
```

### Netlify
Go to Site Settings > Environment Variables

## Post-Deployment Checklist

### Functionality
- [ ] Homepage loads correctly
- [ ] All routes work (no 404s)
- [ ] Wallet connection works
- [ ] Forms submit successfully
- [ ] Images and assets load
- [ ] API calls work
- [ ] HTTPS is enabled

### Performance
- [ ] Run Lighthouse audit (target: 90+)
- [ ] Check Core Web Vitals
- [ ] Verify asset caching
- [ ] Test on 3G connection
- [ ] Check bundle size

### SEO
- [ ] Sitemap.xml accessible
- [ ] Robots.txt configured
- [ ] Meta tags present
- [ ] Open Graph tags set
- [ ] Schema markup added

### Security
- [ ] HTTPS enabled
- [ ] Security headers set
- [ ] CSP configured
- [ ] No sensitive data exposed
- [ ] CORS configured properly

### Monitoring
- [ ] Analytics tracking
- [ ] Error tracking (Sentry, etc.)
- [ ] Performance monitoring
- [ ] Uptime monitoring

## Configuration Files

### vercel.json
Already configured in project root with:
- SPA routing (all routes → index.html)
- Security headers
- Asset caching

### netlify.toml (Optional)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

## Custom Domain Setup

### DNS Configuration

For `chainbounty.com`:

**Vercel:**
- A Record: @ → 76.76.21.21
- CNAME: www → cname.vercel-dns.com

**Netlify:**
- A Record: @ → (Netlify load balancer IP)
- CNAME: www → YOUR_SITE.netlify.app

**Cloudflare:**
- Enable proxy (orange cloud)
- A Record: @ → Your origin IP
- CNAME: www → @ (or origin)

### SSL Certificate

- **Vercel/Netlify**: Automatic (Let's Encrypt)
- **Manual**: Use Let's Encrypt or Cloudflare

## Rollback

### Vercel
```bash
vercel rollback
```

Or via dashboard: Deployments → Select previous → Promote to Production

### Netlify
Via dashboard: Deploys → Select previous → Publish deploy

## Troubleshooting

### Issue: Routes return 404
**Solution**: Configure SPA redirects (see above)

### Issue: Environment variables not working
**Solution**: Ensure variables start with `VITE_` and redeploy

### Issue: Build fails
**Solution**: Check build logs, ensure all dependencies are in `package.json`

### Issue: Slow loading
**Solution**: 
- Enable caching headers
- Optimize images
- Check CDN configuration

### Issue: CORS errors
**Solution**: Configure API backend to allow your domain

## Monitoring

### Analytics
- Google Analytics
- Plausible Analytics
- Mixpanel

### Error Tracking
- Sentry
- LogRocket
- Bugsnag

### Performance
- Vercel Analytics
- Google PageSpeed Insights
- WebPageTest

## Support

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Vite Deploy Guide: https://vitejs.dev/guide/static-deploy.html

---

**Deployed!** 🚀 Your ChainBounty frontend is now live!
