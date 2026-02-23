# 🚀 Deployment Guide - GitHub Pages

This guide will help you deploy Math Jenga to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your local machine
- Your project pushed to a GitHub repository

## Setup Instructions

### Step 1: Configure Repository Settings

1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click on **Pages**
4. Under **Build and deployment**:
   - **Source**: Select "GitHub Actions"

### Step 2: Configure the Base Path (if needed)

If your repository is **NOT** named `username.github.io`, you need to update the base path:

1. Open [next.config.ts](next.config.ts)
2. Uncomment these lines and replace `math_jenga` with your repository name:
```typescript
basePath: '/math_jenga',
assetPrefix: '/math_jenga',
```

**Example:** If your repo is `github.com/johndoe/my-jenga-game`, use:
```typescript
basePath: '/my-jenga-game',
assetPrefix: '/my-jenga-game',
```

### Step 3: Push Your Changes

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

### Step 4: Deployment

The GitHub Actions workflow will automatically:
1. Build your Next.js application
2. Generate static files in the `out` directory
3. Deploy to GitHub Pages

Monitor the deployment:
1. Go to your repository on GitHub
2. Click on the **Actions** tab
3. You should see a workflow running called "Deploy to GitHub Pages"
4. Wait for it to complete (usually 1-3 minutes)

### Step 5: Access Your Site

Once deployed, your site will be available at:

- **If repo is `username.github.io`**: `https://username.github.io`
- **If repo has a custom name**: `https://username.github.io/repository-name`

## Manual Deployment (Alternative)

If you prefer to deploy manually without GitHub Actions:

1. Build the project:
```bash
npm run build
```

2. The static files will be in the `out` directory

3. You can deploy the `out` directory to any static hosting service (Netlify, Vercel, etc.)

## Troubleshooting

### Issue: 404 Error on page load

**Solution**: Make sure you've set the correct `basePath` in `next.config.ts`

### Issue: Images not loading

**Solution**: Verify that `images.unoptimized: true` is set in `next.config.ts`

### Issue: \_next folder showing 404

**Solution**: Make sure `.nojekyll` file exists in the `public` folder

### Issue: Workflow fails

**Solution**: 
1. Check that your repository has Pages enabled
2. Verify that the workflow has proper permissions (Settings > Actions > General > Workflow permissions)
3. Make sure "Read and write permissions" is enabled

## Custom Domain (Optional)

To use a custom domain:

1. In your repository settings, go to **Pages**
2. Under **Custom domain**, enter your domain
3. Create a `CNAME` file in the `public` folder with your domain

Example `public/CNAME`:
```
mathjenga.example.com
```

## Development vs Production

- **Development**: Run `npm run dev` for hot-reload development
- **Production Preview**: Run `npm run build` to test the production build locally
- **GitHub Pages**: Automatically deploys when you push to `main` branch

## Additional Resources

- [Next.js Static Exports Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Note**: The first deployment might take a few minutes. Subsequent deployments are usually faster.
