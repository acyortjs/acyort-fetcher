# acyort-fetcher

[![Build Status](https://travis-ci.org/acyortjs/acyort-fetcher.svg?branch=master)](https://travis-ci.org/acyortjs/acyort-fetcher)
[![codecov](https://codecov.io/gh/acyortjs/acyort-fetcher/branch/master/graph/badge.svg)](https://codecov.io/gh/acyortjs/acyort-fetcher)

Fetcher for [AcyOrt](https://github.com/acyortjs/acyort)

## Install

```bash
$ npm i acyort-fetcher -S
```

## Usage

```js
// npm i fs-extra -S
const fs = require('fs')
const Fetcher = require('acyort-fetcher')

const config = {
  user: 'LoeiFy',         // github username
  repository: 'Recordum', // github repository
  per: 5,                 // per_page
  order: 'created',       // 'created' or 'updated'
  cache: false,           // if cache json data. create a json file in current path
  base: process.cwd(),    // current path
  token: 'xxxx'           // github access token
}
const fetcher = new Fetcher({ config, fs })

fetcher.status = status => {
  console.log(status)     // requests information
}

fetcher.fetch()
  .then(res => console.log(res))    // the json data
  .catch(err => console.log(err))   // error
```
