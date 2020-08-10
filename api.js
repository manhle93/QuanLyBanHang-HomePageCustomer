import axios from "axios";
// import Store from './store'
import { END_POINT } from '@/env'

export default {
  getToken () {
    return localStorage.getItem('jwt_token')
  },

  setToken (token) {
    localStorage.setItem('jwt_token', token)
  },

  deleteToken () {
    localStorage.removeItem('jwt_token')
  },


  processHeaders (header) {
    return header === true ? {Authorization: `Bearer ${this.getToken()}`} : header
  },

  getAuthFormDataHeader () {
    return {
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'multipart/form-data'
    }
  },

  get (url, params = {}, notification = false, auth = true) {
    return this.submit('get', url, params, notification, auth)
  },

  post (url, data = {}, notification = false, auth = true) {
    return this.submit('post', url, data, notification, auth)
  },

  put (url, data = {}, notification = false, auth = true) {
    return this.submit('put', url, data, notification, auth)
  },

  delete (url, data = {}, notification = false, auth = true) {
    return this.submit('delete', url, data, notification, auth)
  },

  submitOnce (method, url, params = {}, auth = undefined) {
    let preUrl = ""
    if (url.substr(0,4) !== "http") {
      console.log(END_POINT)
      preUrl = END_POINT
    }
    let obj = {
      method: method,
      url: preUrl + url,
      headers: this.processHeaders(auth)
    }
    if (String(method).toLowerCase() === 'get') {
      obj.params = params
    } else {
      obj.data = params
    }
    return axios(obj)
  },

  submit (method, url, params = {}, notification = false, auth = true) {
    // if (notification) Store.commit('setProgress', true)
    return new Promise((resolve, reject) => {
      this.submitOnce(method, url, params, auth)
        .then(response => {
          this._handleSuccess(response, notification)
          resolve(response)
        })
        .catch(error => {
          if (this._shouldRefreshToken(error)) {
            this.submitOnce('get', 'auth/refresh', {}, true)
              .then(response => {
                this.setToken(response.data.access_token)
                this.submitOnce(method, url, params, auth)
                  .then(response => {
                    this._handleSuccess(response, notification)
                    resolve(response)
                  })
                  .catch(error => {
                    this._handleError(error, notification)
                    reject(error)
                  })
              })
              .catch(error => {
                this._handleError(error, notification)
                reject(error)
              })
          } else {
            this._handleError(error, notification)
            reject(error)
          }

        })
    })

  },

  _shouldRefreshToken (error) {
    return error.response && error.response.status === 401
      && (error.response.data.code === 'token_expire' || error.response.data.code === 'unauthorized.')
  },

  _handleError (error, notify) {
    // Store.commit('setProgress', false)
    if (error.response) {
      let code = error.response.status
      if (code === 403 && error.response.data.code === 'validation') {
        let data = error.response.data.data
        let key = Object.keys(data)[0]
        // Store.commit('showErrorSnackbar', data[key][0])
      } else {
        // Store.commit('showErrorSnackbar', error.response.data.message)
      }
    } else {
      // Store.commit('showErrorSnackbar', error.toJSON().message)
    }
  },

  _handleSuccess (success, notify) {
    // Store.commit('setProgress', false)
    if (notify) {
      // Store.commit('showInfoSnackbar', success.data.message)
    }
  }
}
