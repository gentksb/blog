# README

This is gensobunya's bike blog repository.

[Go to website](http://blog.gensobunya.net)

## Build & Deploy Pipeline

### Build for

Cloudflare Workers + Static Assets (w/ KV)

### Local Development

```bash
# Setup authentication
npx wrangler login

# Development server (Astro only)
pnpm dev

# Development with Workers environment
pnpm dev:cf

# Build
pnpm build

# Deploy
wrangler deploy
```

### Environment Variables

```bash
# dev.vars
PAAPI_ACCESSKEY=your-pa-api-access-key
PAAPI_SECRETKEY=your-pa-api-secret-key
PARTNER_TAG=your-amazon-associate-tag
SLACK_WEBHOOK_URL=your-slack-webhook-url
```

- **PAAPI_ACCESSKEY**: PA-API v5 Access Key ID
- **PAAPI_SECRETKEY**: PA-API v5 Secret Key
- **PARTNER_TAG**: Amazon Associate Partner Tag
- **SLACK_WEBHOOK_URL**: Slack webhook URL for error logging

## Operation

Delete OGP caches: <https://developers.cloudflare.com/kv/platform/kv-commands/#delete-2>

## Maintenance Tools

### Image Resize Script

A batch script for resizing large image files in `src/content/` to reduce repository size.

**Usage:**

```bash
./resize_images.sh
```

**Processing:**

- Target: Image files (jpg, jpeg, png, webp) in `src/content/`
- Condition: Images with width ≥ 1200px only
- Action: Resize to width ≤ 1200px (maintain aspect ratio)
- Safety: Creates backup before processing, auto-restores on error

**Requirements:**

- ImageMagick (`identify`, `mogrify` commands)
- One-time execution script - backup important files before running
