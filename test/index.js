const Fetcher = require('../')

const config = {
  user: 'LoeiFy',
  repository: 'Recordum',
  per: 5,
  order: 'created',
  cache: true
}
const fetcher = new Fetcher(config)

fetcher.status = (s) => {
  console.log(s)
}

fetcher.fetch()
.then(res => console.log(res))
.catch(err => console.log(err))


