# Schul-Cloud Content-Editor

[![Travis Status](https://travis-ci.com/schul-cloud/schulcloud-content-editor.svg?branch=master)](https://travis-ci.com/schul-cloud/schulcloud-content-editor) [![Greenkeeper badge](https://badges.greenkeeper.io/schul-cloud/schulcloud-content-editor.svg)](https://greenkeeper.io/)

[![Deploy badge](https://img.shields.io/badge/Demo-Deployed-brightgreen.svg)](https://schul-cloud.github.io/schulcloud-content-editor/)

> Build with [Vue.js](https://vuejs.org)

## Setup

```bash
# clone repo to your device
git clone https://github.com/schul-cloud/schulcloud-content-editor.git

# install dependencies
npm install

# install vue-cli
npm install -g @vue/cli
```

## Build & Development

We definietly recommend using the vue-cli.

> `$ vue ui`

Then import the project and use all the awesome features.

But if you really like your console feel free to use:

```bash
# serve with hot reload at localhost:8080
npm run serve

# build for production with minification
npm run build

# run tests
npm run test
```

## How to name your branch

1. Take the id of your github issue (e.g. 2 for [this issue](https://github.com/schul-cloud/schulcloud-content-editor/issues/2))
2. add a short description <br> => result: e.g. Branch: "2-real-Loginform"

## Testing

```bash
# run lint & run build & check bundlesize
npm run travis
```

## Deployment

### NODE_ENV during build

| node-env                   | default               | info                                                                           |
| -------------------------- | --------------------- | ------------------------------------------------------------------------------ |
| VUE_APP_PUBLIC_PATH        | /                     | [link](https://cli.vuejs.org/guide/deployment.html#github-pages)               |
| VUE_APP_SERVER_SERVER_URL  | http://localhost:3030 | URL to [schulcloud-server](https://github.com/schul-cloud/schulcloud-server)   |
| VUE_APP_CONTENT_SERVER_URL | http://localhost:4040 | URL to [schulcloud-content](https://github.com/schul-cloud/schulcloud-content) |
