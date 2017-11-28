const axios = require('axios')

class Request {
  constructor(config) {
    const {
      user,
      repository,
      token,
      order,
      per,
    } = config

    this.host = 'https://api.github.com'
    this.path = `/repos/${user}/${repository}/issues`
    this.token = token ? token.split('#').join('') : ''
    this.per = per
    this.order = order
  }

  getConfig(page) {
    const headers = { 'User-Agent': 'AcyOrt' }

    if (this.token) {
      headers.Authorization = `token ${this.token}`
    }

    return {
      url: this.path,
      method: 'get',
      baseURL: this.host,
      headers,
      params: {
        per_page: this.per,
        page,
        sort: this.order,
      },
    }
  }

  get(page) {
    return axios(this.getConfig(page))
  }
}

module.exports = Request
