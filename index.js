const path = require('path')
const fs = require('fs')
const Request = require('./request')

function ifNext(headers) {
  const { link } = headers
  return link && link.indexOf('rel="next"') > -1
}

class Fetcher extends Request {
  constructor(config) {
    super(config)
    this.config = config
    this.json = path.join(config.base, '_issues.json')
    this.page = 1
    this.issues = []
    this.callback = () => {}
  }

  set status(fn) {
    this.callback = fn
  }

  getJson() {
    try {
      return JSON.parse(fs.readFileSync(this.json, 'utf8'))
    } catch (e) {
      return false
    }
  }

  setJson() {
    if (this.config.cache) {
      fs.writeFileSync(this.json, JSON.stringify(this.issues), 'utf8')
    }
  }

  load(resolve, reject) {
    const {
      config: {
        user,
        repository,
      },
      page,
    } = this
    const msg = `Getting data from GitHub (${user}/${repository})`

    if (!user || !repository) {
      return reject(new Error('Empty user or repository fields'))
    }

    this.callback(`${msg} ... ${page}`)

    return this.get(page)
      .then(({ data, headers }) => {
        this.issues = this.issues.concat(data)

        if (!ifNext(headers)) {
          this.setJson()
          resolve(this.issues)
        } else {
          this.page += 1
          setTimeout(() => { this.load(resolve, reject) }, 1000)
        }
      })
      .catch(err => reject(new Error(err)))
  }

  fetch() {
    if (this.config.cache) {
      const json = this.getJson()

      if (json) {
        this.callback('Data from cache...')
        return Promise.resolve(json)
      }
    }

    return new Promise((resolve, reject) => this.load(resolve, reject))
  }
}

module.exports = Fetcher
