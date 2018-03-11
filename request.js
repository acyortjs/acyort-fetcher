const axios = require('axios')

class Request {
  constructor(config) {
    const {
      user,
      repository,
      token,
      order,
      perpage,
    } = config

    this.host = 'https://api.github.com'
    this.path = `/repos/${user}/${repository}/issues`
    this.token = token ? token.split('#').join('') : ''
    this.order = order
    this.perpage = perpage || 20
    this.getHtml = false
    this.axios = axios
  }

  getGithub(params) {
    const headers = { 'User-Agent': 'AcyOrt' }
    const config = params

    if (this.token) {
      headers.Authorization = `token ${this.token}`
    }

    if (config.headers) {
      config.headers = Object.assign(headers, config.headers)
    } else {
      config.headers = headers
    }

    return this.axios(config)
  }

  getConfig(page) {
    const config = {
      url: this.path,
      baseURL: this.host,
      params: {
        per_page: this.perpage,
        page,
        sort: this.order,
      },
    }

    if (this.getHtml) {
      config.headers = { Accept: 'application/vnd.github.v3.full' }
    }

    return config
  }

  get(page) {
    return this.getGithub(this.getConfig(page))
  }
}

module.exports = Request
