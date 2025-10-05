# Netlify Deployment Guide for Chess Game

This guide will help you deploy your chess game to Netlify successfully.

## 🚀 Quick Deploy

### Option 1: Deploy from GitHub (Recommended)
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub account
4. Select your repository (`ShivamGite777/onchess`)
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`
6. Click "Deploy site"

### Option 2: Drag & Drop Deploy
1. Run `npm run build` locally
2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist` folder to the deploy area
4. Your site will be live instantly

## ⚙️ Build Settings

If you need to configure manually in Netlify dashboard:

### Build & Deploy Settings:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18`

### Environment Variables (if needed):
- `NODE_VERSION`: `18`
- `NPM_FLAGS`: `--production=false`

## 🔧 Configuration Files

The project includes these Netlify-specific files:

### `netlify.toml`
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### `public/_redirects`
```
/*    /index.html   200
```

### `vite.config.ts`
```typescript
export default defineConfig({
  base: './',  // Important for Netlify
  build: {
    outDir: 'dist',
    // ... other config
  }
})
```

## 🐛 Troubleshooting

### If you get 404 errors:

1. **Check Build Logs**:
   - Go to your Netlify dashboard
   - Click on your site
   - Go to "Deploys" tab
   - Check if the build succeeded

2. **Verify Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

3. **Check Redirects**:
   - Go to "Site settings" > "Redirects and rewrites"
   - Ensure there's a rule: `/*` → `/index.html` (200)

4. **Clear Cache**:
   - Go to "Deploys" tab
   - Click "Trigger deploy" > "Clear cache and deploy site"

### Common Issues:

**Issue**: "Page not found" error
**Solution**: The redirects are not working. Check the `netlify.toml` file and ensure redirects are configured.

**Issue**: Assets not loading (CSS/JS files)
**Solution**: Check if the `base: './'` is set in `vite.config.ts` and rebuild.

**Issue**: Build fails
**Solution**: Check the build logs for specific errors. Usually it's a dependency issue.

## 📱 Testing Your Deployment

1. **Check the main page** loads correctly
2. **Test navigation** - try refreshing the page
3. **Test on mobile** - ensure responsive design works
4. **Test all game modes** - Local, Computer, Online
5. **Check console** for any JavaScript errors

## 🔄 Updating Your Site

Every time you push to your main branch:
1. Netlify will automatically rebuild and deploy
2. You'll get a notification when it's done
3. Check the "Deploys" tab to see the status

## 📊 Performance Tips

- The site is optimized for fast loading
- Assets are cached for better performance
- Images are optimized automatically
- CSS and JS are minified

## 🎯 Expected Result

After successful deployment, you should see:
- ✅ Chess game loads without errors
- ✅ All game modes work (Local, Computer, Online)
- ✅ Responsive design works on mobile
- ✅ No 404 errors when refreshing pages
- ✅ Sound effects work (if enabled)
- ✅ Timer and game features work properly

## 🆘 Need Help?

If you're still having issues:
1. Check the Netlify documentation
2. Look at the build logs for specific errors
3. Verify all configuration files are correct
4. Test the build locally with `npm run build && npm run preview`

Your chess game should now work perfectly on Netlify! 🎉