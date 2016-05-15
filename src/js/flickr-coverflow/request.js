let ReadyState = {
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4,

  0: 'UNSENT',
  1: 'OPENED',
  2: 'HEADERS_RECEIVED',
  3: 'LOADING',
  4: 'DONE'
}

let Status = {
  SUCCESS: 200,
  NOT_MODIFIED: 302,

  BAD_REQUEST: 400,
  AUTHENTICATION_FAILED: 401,
  AUTHENTICATION_REQUIRED: 403,
  NOT_FOUND: 404,

  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,

  200: 'SUCCESS',
  302: 'NOT_MODIFIED',

  400: 'BAD_REQUEST',
  401: 'AUTHENTICATION_FAILED',
  403: 'AUTHENTICATION_REQUIRED',
  404: 'NOT_FOUND',

  500: 'SERVER_ERROR',
  503: 'SERVICE_UNAVAILABLE'
}

class Request {
  static METHODS = Object.freeze({
    GET: 'GET',
    PUT: 'PUT',
    POST: 'POST',
    DELETE: 'DELETE'
  })

  static ERRORS = {
    UNKNOWN: '',
    UNKNOWN_CLIENT_ERROR: '',
    UNKNOWN_SERVER_ERROR: ''
  }

  static DEFAULT_METHOD = Request.METHODS.GET

  static _init() {
    let errors = Request.ERRORS

    Object.keys(errors).forEach((name) => {
      if (!errors[name]) {
        errors[name] = name
      }
    })

    Object.keys(Status).filter((id) => {
      return isNaN(parseInt(id, 10))
        && Status[id] !== Status.SUCCESS
        && Status[id] !== Status.NOT_MODIFIED
    })
      .forEach((name) => errors[name] = name)

    Request.ERRORS = Object.freeze(errors)
  }

  set method(method) {
    let methods

    if (!Request.METHODS[method]) {
      methods = Object.keys(Request.METHODS).join(', ')
      throw Error('method must be one of ' + methods)
    } else {
      this._method = method
    }
  }

  get method() {
    return this._method
  }

  constructor(url) {
    if (typeof url !== 'string' || !url.trim()) {
      throw 'url argument must be a non-empty string'
    }

    this._url = url
  }

  send(data, queryParams) {
    return new Promise(
      (resolve, reject) => {
        let httpRequest
        let headers = this.headers
        let parametrizedUrl = this._url
        let hasBody = false

        if (typeof XMLHttpRequest !== undefined) {
          httpRequest = new XMLHttpRequest()

          if (queryParams) {
            parametrizedUrl += (parametrizedUrl.indexOf('?') < 0 ? '?' : '&') + this._toQueryParams(queryParams)
          }

          if (data) {
            if (this._method !== Request.METHODS.POST && this._method !== Request.METHODS.PUT) {
              parametrizedUrl += (parametrizedUrl.indexOf('?') < 0 ? '?' : '&') + this._toQueryParams(data)
            } else {
              hasBody = true
            }
          }

          httpRequest.onreadystatechange = this._onreadystatechange.bind(
            this,
            {
              httpRequest,
              parametrizedUrl,
              resolve,
              reject
            }
          )

          httpRequest.open(this._method || Request.DEFAULT_METHOD, parametrizedUrl)

          if (headers) {
            Object.keys(headers).forEach(function addHeader(header) {
              httpRequest.setRequestHeader(header, headers[header])
            })
          }

          httpRequest.send(hasBody && JSON.stringify(data))
        } else {
          reject(Error('"XMLHttpRequest" is not supported by the browser'))
        }
      }
    )
  }

  _toQueryParams(data) {
    let queryString

    if (typeof data === 'object') {
      queryString = []

      Object.keys(data).forEach((property) => {
        queryString.push([property, data[property]].join('='))
      })

      return encodeURI(queryString.join('&'))
    } else {
      return encodeURI(data.replace(/^\?/, ''))
    }
  }

  _onreadystatechange({httpRequest, parametrizedUrl, resolve, reject}) {
    let response
    let error

    if (httpRequest.readyState === ReadyState.DONE) {
      switch (httpRequest.status) {
        case Status.NOT_MODIFIED:
        case Status.SUCCESS:
          {

            response = {
              text,

              get headers() {
                var responseHeaders = {}

                httpRequest.getAllResponseHeaders().split(/\r?\n/).forEach((header) => {
                  var colonIndex = header.indexOf(':')
                  responseHeaders[header.substring(0, colonIndex)] = header.substring(colonIndex + 1).trim()
                })

                // caching processed headers
                Object.defineProperty(this, 'headers', { value })

                return responseHeaders
              }
            }

            resolve(response)
            break
          }

        default:
          {
            error = this._buildError(httpRequest.status, parametrizedUrl)
            Logger.error(error.toString())
            reject(error)
          }

      }
    }
  }

  _buildError(status, url) {
    var error = Error([status, ' HTTP ERROR occurred on url "', url, '"'].join(''))
    var name = Status[status]

    if (!name) {
      if (status >= Status.BAD_REQUEST && status < Status.SERVER_ERROR) {
        name = Request.ERRORS.UNKNOWN_CLIENT_ERROR
      } else {
        if (status >= Status.SERVER_ERROR) {
          name = Request.ERRORS.UNKNOWN_SERVER_ERROR
        } else {
          name = Request.ERRORS.UNKNOWN
        }
      }
    }

    error.name = name
    return error
  }
}

Request._init()

export default Request