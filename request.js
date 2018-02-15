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
    this.perpage = perpage
    this.order = order
    this.userAgent = 'AcyOrt'
  }

  getConfig(page) {
    const headers = {}
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

  axios(args) {
    const { headers = {} } = args
    headers['User-Agent'] = this.userAgent
    return axios(Object.assign(args, { headers }))
  }

  get(page) {
    return this.axios(this.getConfig(page))
  }
}

module.exports = Request
