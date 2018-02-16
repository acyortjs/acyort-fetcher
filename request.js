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
    this.axios = axios
  }

  getConfig(page) {
    const headers = { 'User-Agent': 'AcyOrt' }

    if (this.token) {
      headers.Authorization = `token ${this.token}`
    }

    return {
      url: this.path,
      method: 'get',
      headers,
      baseURL: this.host,
      params: {
        per_page: this.perpage,
        page,
        sort: this.order,
      },
    }
  }

  get(page) {
    return this.axios(this.getConfig(page))
  }
}

module.exports = Request
