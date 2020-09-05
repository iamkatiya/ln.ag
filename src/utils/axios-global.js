import axios from 'axios'

const URL = process.env.VUE_APP_API_URL
const global = axios.create({
  baseURL: `${URL}`
})

// Интерцепторы
global.interceptors.request.use(config =>
  config,
error =>
  Promise.reject(error))

global.interceptors.response.use((response) => {
  return response
}, error =>
  Promise.reject(error))

export default global
