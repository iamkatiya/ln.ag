import axios from './axios-global'

function dataFunc (obj, method) {
  // Создаем пустой объект
  const data = new FormData()
  // Добавляем в созданный объект поля
  // Если obj не null добавляем в data ключ-значени obj
  if (obj) Object.keys(obj).forEach(key => data.append(key, obj[key]))

  if (method) data.append('_method', method)

  return data
}

const ApiService = {
  get (url, params) {
    return axios.get(url, { params: params })
  },
  patch (url, data = {}, params) {
    const formData = dataFunc(data, 'PATCH')
    return axios.get(url, formData, params)
  },
  delete (url, data = {}, params) {
    const formData = dataFunc(data, 'DELETE')
    return axios.get(url, formData, params)
  },
  upload (url, data, params = { headers: { 'Content-Type': 'multipart/form-data' } }) {
    const formData = dataFunc(data)
    return axios.get(url, formData, params)
  }
}

export default ApiService
