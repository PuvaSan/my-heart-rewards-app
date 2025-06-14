# Heart Rewards App - Deployment Guide

## Netlify Deployment

### Prerequisites

1. A Netlify account (free tier is sufficient)
2. This repository pushed to GitHub/GitLab/Bitbucket

### Deployment Steps

1. **Connect Repository to Netlify**

   - Log into Netlify
   - Click "New site from Git"
   - Choose your Git provider and select this repository

2. **Build Settings**

   - Build command: `npm run build:netlify`
   - Publish directory: `dist/public`
   - Node version: `18` (set in netlify.toml)

3. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your app

### Custom Domain (Optional)

1. In Netlify dashboard, go to "Domain settings"
2. Add your custom domain
3. Follow DNS configuration instructions

## PWA Setup

### Icon Requirements

Replace the placeholder icon files in `client/public/` with actual images:

- `favicon.ico` - 32x32 favicon
- `apple-touch-icon.png` - 180x180 Apple touch icon
- `pwa-192x192.png` - 192x192 PWA icon
- `pwa-512x512.png` - 512x512 PWA icon
- `masked-icon.svg` - SVG icon for Safari pinned tabs

### Icon Design Guidelines

- Use bright, child-friendly colors
- Include heart theme elements
- Recommended colors: Teal (#4ade80), Coral (#ff6b6b), Sunny (#fbbf24)
- Ensure good contrast and readability at small sizes

### PWA Features Included

- ✅ Offline functionality with service worker
- ✅ App-like experience on mobile devices
- ✅ Install prompt on supported browsers
- ✅ Optimized for iPad with proper viewport settings
- ✅ Cached fonts and external resources
- ✅ Standalone display mode
- ✅ Theme color matching app design

## Local Testing

### Test PWA Features

```bash
npm run build:netlify
npm run preview
```

Then visit `http://localhost:4173` and:

1. Open browser dev tools
2. Go to "Application" tab
3. Check "Service Workers" and "Manifest" sections
4. Test offline functionality by going offline in dev tools

### Test on Mobile/iPad

1. Deploy to Netlify (or use ngrok for local testing)
2. Visit the URL on your iPad/iPhone
3. Tap the share button and "Add to Home Screen"
4. Test the app from the home screen icon

## Production Optimizations

The build includes:

- Code splitting for faster loading
- Asset caching with proper cache headers
- Service worker for offline functionality
- Optimized bundle sizes
- PWA manifest for app-like experience

## Troubleshooting

### Icons Not Showing

- Ensure all icon files are actual images (not placeholder text files)
- Check browser console for 404 errors
- Verify file paths in the manifest

### PWA Not Installing

- Check that all required manifest fields are present
- Ensure HTTPS is enabled (required for PWA)
- Verify service worker is registering successfully

### Build Errors

- Run `npm run check` to check TypeScript errors
- Ensure all dependencies are installed: `npm install`
- Check Node.js version (requires Node 18+)
