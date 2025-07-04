# README

This is gensobunya's bike blog repository.

[Go to website](http://blog.gensobunya.net)

## Build & Deploy Pipeline

### Build for

Cloudflare Pages(w/ KV) and Functions

### local development

At first, run `npx wrangler login` before start local environment.

### environment variables

```bash
# dev.vars
  PAAPI_ACCESSKEY
  PAAPI_SECRETKEY
  PARTNER_TAG
  SLACK_WEBHOOK_URL
```

- PAAPI_ACCESSKEY: PA-API v5 Access key ID
- PAAPI_SECRETKEY: PA-API v5 Secret key
- PARTNER_TAG: Amazon Associate Partner Tag
- SLACK_WEBHOOK_URL: your slack webhook url for logger

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
