const assert = require('power-assert')
const fs = require('fs')
const path = require('path')
const Fetcher = require('../')

const defaults = {
  user: 'LoeiFy',
  repository: 'Recordum',
  order: 'created',
  cache: false,
  perpage: 5,
  base: __dirname,
  token: 'e#ef41a2f6af820b93a625bf29b8465e4d208c3f0'
}

const json = path.join(__dirname, '_issues.json')

function rejects(promise) {
  return promise
    .then(() => Promise.reject(new Error('Missing expected rejection')))
    .catch(reason => Promise.resolve(reason))
}

function getConfig() {
  return JSON.parse(JSON.stringify(defaults))
}

describe('fetcher', () => {
  it('body html', async function() {
    this.timeout(10000)

    const config = getConfig()
    config.perpage = 20
    const fetcher = new Fetcher(config)

    fetcher.setHeaders({ Accept: 'application/vnd.github.v3.full' })

    const result = await fetcher.fetch()

    assert(Object.keys(result[0]).indexOf('body_html') > -1)
    assert(Object.keys(result[0]).indexOf('body') > -1)
    assert(Object.keys(result[0]).indexOf('body_text') > -1)
  })

  it('token error', async function() {
    this.timeout(10000)

    const config = getConfig()
    config.token = 'xxx'
    const fetcher = new Fetcher(config)

    assert((await rejects(fetcher.fetch())).message.indexOf('401') > -1)
  })

  it('json', async function() {
    this.timeout(10000)

    const config = getConfig()
    const fetcher = new Fetcher(config)
    const messages = []

    fetcher.status = (s) => {
      messages.push(s)
    }

    const result = await fetcher.fetch()

    assert(Array.isArray(result) === true)
    assert(messages.length === Math.ceil(result.length / config.perpage))
  })

  it('no token', async function() {
    this.timeout(10000)

    const config = getConfig()
    config.token = ''
    delete config.perpage

    const fetcher = new Fetcher(config)

    try {
      const result = await fetcher.fetch()
      assert(Array.isArray(result) === true)
    } catch (e) {
      assert(e.message.indexOf('Maximum') > -1)
    }
  })

  it('cache', async function() {
    this.timeout(10000)

    const config = getConfig()
    config.cache = true
    const fetcher = new Fetcher(config)
    let result = await fetcher.fetch()

    assert(Object.keys(result[0]).indexOf('body_html') === -1)

    assert(fs.existsSync(json) === true)

    let msg = ''
    fetcher.status = (s) => {
      msg = s
    }

    result = await fetcher.fetch()

    assert(Array.isArray(result) === true)
    assert(msg === 'Data from cache...')
  })
})
