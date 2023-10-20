# README

This is gensobunya's bike blog repository.

[Go to website](http://blog.gensobunya.net)

## Build & Deploy Pipeline

### Build for

Cloudflare Pages and Functions

### environment variables

```bash
# dev.vars
# .env
  PAAPI_ACCESSKEY
  PAAPI_SECRETKEY
  PARTNER_TAG
  CLOUDFLARE_KV_TOKEN
  CLOUDFLARE_ACCOUNT_IDENTIFIER
  OGP_DATASTORE_ID
```

- PAAPI_ACCESSKEY: PA-API v5 Access key ID
- PAAPI_SECRETKEY: PA-API v5 Secret key
- PARTNER_TAG: Amazon Associate Partner Tag
- CLOUDFLARE_KV_TOKEN: Cloudflare v4 API Token which need "KV edit" role
- CLOUDFLARE_ACCOUNT_IDENTIFIER: Cloudflare Account ID(not email)
- OGP_DATASTORE_ID: Cloudflare KV ID (not local-preview ID)
