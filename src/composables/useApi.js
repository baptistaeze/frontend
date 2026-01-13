import api from '../services/api'

export default function useApi() {
  const get = (url, config = {}) =>
    api.get(url, config)
      .then(res => res.data)
      .catch(err => { throw err })
      .finally(() => {})

  const post = (url, data, config = {}) =>
    api.post(url, data, config)
      .then(res => res.data)
      .catch(err => { throw err })
      .finally(() => {})

  const put = (url, data, config = {}) =>
    api.put(url, data, config)
      .then(res => res.data)
      .catch(err => { throw err })
      .finally(() => {})

  const del = (url, config = {}) =>
    api.delete(url, config)
      .then(res => res.data)
      .catch(err => { throw err })
      .finally(() => {})

  return { get, post, put, del }
}