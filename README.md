# Schul-Cloud Content-Editor ![Travis Status](https://travis-ci.org/schul-cloud/schulcloud-content-editor.svg?branch=master)

[![Greenkeeper badge](https://badges.greenkeeper.io/schul-cloud/schulcloud-content-editor.svg)](https://greenkeeper.io/)

> Build with [Vue.js](https://vuejs.org)

## Setup

``` bash
# clone repo to your device
git clone https://github.com/schul-cloud/schulcloud-content-editor.git

# install dependencies
npm install

# install vue-cli
npm install -g @vue/cli
```

## Build & Development

We definietly recommend using the vue-cli.
 >`$ vue ui`

Then import the project and use all the awesome features.

But if you really like your console feel free to use:
``` bash
# serve with hot reload at localhost:8080
npm run serve

# build for production with minification
npm run build

# run tests
npm run test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## How to name your branch

1. Take the id of your github issue (e.g. 2 for [this issue](https://github.com/schul-cloud/schulcloud-content-editor/issues/2))
2. add a short description <br>
=> result: e.g. Branch: "2-real-Loginform"

## Commiting

Default branch: master

1. Go into project folder
2. Run the tests (see above)
3. Commit with a meanigful commit message(!) even at 4 a.m. and not stuff like "dfsdfsf"
4. Checkout to master branch
5. Run `git pull`
6. Checkout to the branch you want to upload
7. run `git rebase -p develop` (not `git merge`!) and solve merge conflicts if needed
8. run `git push`

## Testing
``` bash
# run build & check bundlesize
npm run travis
```
