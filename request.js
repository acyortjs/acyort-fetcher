const axios = require('axios')

class Request {
  constructor(config) {
    const {
      user,
      repository,
      token,
      order,
      perpage,
      headers = {},
    } = config

    this.host = 'https://api.github.com'
    this.path = `/repos/${user}/${repository}/issues`
    this.token = token ? token.split('#').join('') : ''
    this.order = order
    this.perpage = perpage || 20
    this.axios = axios
    this.headers = headers
  }

  getGithub(params) {
    const headers = { 'User-Agent': 'AcyOrt' }
    const config = params

    if (this.token) {
      headers.Authorization = `token ${this.token}`
    }

    config.headers = Object.assign(headers, params.headers || {}, this.headers)

    return this.axios(config)
  }

  getConfig(page) {
    return {
      url: this.path,
      baseURL: this.host,
      params: {
        per_page: this.perpage,
        page,
        sort: this.order,
      },
    }
  }

  get(page) {
    return this.getGithub(this.getConfig(page))
  }
}

module.exports = Request
