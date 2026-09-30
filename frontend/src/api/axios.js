import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => {
    const body = res.data
    if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
      const payload = body.data
      if (payload && typeof payload === 'object' && 'content' in payload) {
        res.data = payload.content
        res.pagination = {
          totalElements: payload.totalElements,
          totalPages: payload.totalPages,
          page: payload.number,
          size: payload.size,
          first: payload.first,
          last: payload.last,
        }
      } else {
        res.data = payload
      }
      res.success = body.success
      res.message = body.message
    }
    return res
  },
  (err) => {
    if (err.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
