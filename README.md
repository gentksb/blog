# README

This is gensobunya's bike blog repository.

[Go to website](http://blog.gensobunya.net)

## Environment setting

```bash
cd functions
firebase login
firebase use --add
```

## Build & Deploy Pipeline

### Build for

[Gatsby Cloud](https://www.gatsbyjs.com/cloud/) with GitHub master branch trigger.

### Deploy

Hosting at Firebase.

### environment variables

```bash
# env
GATSBY_FIREBASE_API_KEY
GATSBY_FIREBASE_PROJECT_ID
GATSBY_FIREBASE_APP_ID

# functions/env
AMAZON_PAAPI_KEY
AMAZON_PAAPI_SECRET
PARTNER_TAG
```
