const assert = require('power-assert')
const fs = require('fs-extra')
const path = require('path')
const Fetcher = require('../')

const defaults = {
  user: 'LoeiFy',
  repository: 'Recordum',
  per: 5,
  order: 'created',
  cache: false,
  base: __dirname,
  token: '5#c21bffc137f44faf7e9c4a84da827f7cc2cfeaa'
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
  it('token error', async function() {
    this.timeout(10000)

    const config = getConfig()
    config.token = 'xxx'
    const fetcher = new Fetcher({ config, fs })

    assert((await rejects(fetcher.fetch())).message.indexOf('401') > -1)
  })

  it('json', async function() {
    this.timeout(10000)

    const config = getConfig()
    const fetcher = new Fetcher({ config, fs })
    const messages = []

    fetcher.status = (s) => {
      messages.push(s)
    }

    const result = await fetcher.fetch()

    assert(Array.isArray(result) === true)
    assert(messages.length === Math.ceil(result.length / config.per))
  })

  it('no token', async function() {
    this.timeout(10000)

    const config = getConfig()
    config.token = ''
    const fetcher = new Fetcher({ config, fs })

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
    const fetcher = new Fetcher({ config, fs })
    let result = await fetcher.fetch()

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