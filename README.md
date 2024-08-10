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
# .env
  PAAPI_ACCESSKEY
  PAAPI_SECRETKEY
  PARTNER_TAG
```

- PAAPI_ACCESSKEY: PA-API v5 Access key ID
- PAAPI_SECRETKEY: PA-API v5 Secret key
- PARTNER_TAG: Amazon Associate Partner Tag

## Operation

Delete OGP caches: <https://developers.cloudflare.com/kv/platform/kv-commands/#delete-2>
