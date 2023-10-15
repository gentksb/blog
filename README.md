# README

This is gensobunya's bike blog repository.

[Go to website](http://blog.gensobunya.net)

## Preperation

When `src/consts.ts` > `redirectData` Updated

```bash
pnpm run build:redirect
```

## Build & Deploy Pipeline

### Build for

Cloudflare Pages/Functions

### environment variables

```bash
# dev.vars
# .env
AMAZON_PAAPI_KEY
AMAZON_PAAPI_SECRET
PARTNER_TAG
```
