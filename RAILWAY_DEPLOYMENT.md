# Railway Deployment Guide

This guide explains how to deploy this React + Express app to Railway for better SEO/AEO/GEO.

## How It Works

Railway runs your Express server, which serves both:
- The API endpoints (`/api/*`)
- The built React frontend (static files from `dist/public`)

This is a "single service" deployment - one container handles everything.

## Prerequisites

1. A Railway account (https://railway.app)
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Create Railway Project

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect the configuration from `railway.json` and `nixpacks.toml`

### 2. Add PostgreSQL Database

1. In your Railway project, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway will provision the database and set `DATABASE_URL` automatically

### 3. Configure Environment Variables

In Railway dashboard → Your Service → Variables, add:

**Required:**
- `NODE_ENV` = `production`
- `AI_INTEGRATIONS_OPENAI_API_KEY` - Your OpenAI API key
- `AI_INTEGRATIONS_OPENAI_BASE_URL` - OpenAI base URL (https://api.openai.com/v1)

**For Content Studio:**
- `GEMINI_API_KEY` - Google Gemini API key
- `LEONARDO_API_KEY` - Leonardo AI API key
- `REPLICATE_API_TOKEN` - Replicate API token

**For Newsletter:**
- `RESEND_API_KEY` - Resend email API key
- `NEWSLETTER_ADMIN_KEY` - Admin password for newsletter tool

Note: Railway automatically sets `PORT` and `DATABASE_URL` for you.

### 4. Generate Domain

1. Go to your service settings
2. Click "Generate Domain" to get a `*.railway.app` URL
3. Or add a custom domain

### 5. Deploy

Railway auto-deploys on every push to your main branch. You can also:
- Click "Deploy" to manually trigger
- Use `railway up` CLI command

## Build Process

The deployment uses these files:

**`railway.json`** - Railway configuration
```json
{
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "node dist/index.js",
    "healthcheckPath": "/api/health"
  }
}
```

**`nixpacks.toml`** - Build configuration
```toml
[phases.setup]
nixPkgs = ['nodejs_20', 'pnpm']

[phases.install]
cmds = ['pnpm install --frozen-lockfile']

[phases.build]
cmds = ['pnpm run build']

[start]
cmd = 'node dist/index.js'
```

**Build steps:**
1. `pnpm install` - Install dependencies
2. `pnpm run build` - Builds React (Vite) + bundles Express server
3. `node dist/index.js` - Starts production server

## Railway Advantages

- **Persistent server**: Unlike serverless, Railway runs a full Node.js server
- **No cold starts**: Always running, fast response times
- **Built-in PostgreSQL**: Easy database provisioning
- **SSE support**: Server-Sent Events work perfectly (Newsletter Creator, Content Studio)
- **Generous free tier**: $5 free credits/month

## Custom Domain Setup

1. Go to Settings → Domains
2. Click "Add Custom Domain"
3. Enter your domain (e.g., `keanonbiz.com`)
4. Add the CNAME record to your DNS:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `<your-service>.railway.app`

## Monitoring

- **Logs**: View real-time logs in Railway dashboard
- **Metrics**: CPU, memory, and network usage available
- **Health checks**: Railway monitors `/api/health` endpoint

## Database Migration

If migrating from Replit's database:

1. Export data from Replit PostgreSQL
2. Import into Railway PostgreSQL using the connection string

Railway's `DATABASE_URL` format:
```
postgresql://user:password@host:port/database
```

## Troubleshooting

### Build fails
- Check that all dependencies are in `package.json`
- Verify `pnpm run build` works locally

### Server won't start
- Check logs for errors
- Ensure `PORT` environment variable is used
- Verify `dist/index.js` exists after build

### Database connection fails
- Railway auto-injects `DATABASE_URL`
- Check the variable is visible in service settings

### 502 errors
- Server may be crashing - check logs
- Health check failing - verify `/api/health` returns JSON

## Local Testing

```bash
# Build the project
pnpm run build

# Run production server locally
NODE_ENV=production node dist/index.js
```

## Railway CLI

For advanced users:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
railway up

# View logs
railway logs
```
