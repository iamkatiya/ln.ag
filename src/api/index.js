import ApiService from '../utils/api.service'

const webservice = {
  getGlobalLink (inputUrl) {
    return ApiService.get('shortlink', { link: inputUrl })
  }
}

export default webservice
