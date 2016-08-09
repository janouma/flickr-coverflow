import Logger from 'flickr-coverflow/logger'
import Request from 'flickr-coverflow/request'
import Validator from 'flickr-coverflow/validator'

class FlickrDataSource {
  static _CLASS_ID = '[flickr-coverflow/FlickrDataSource]'
  static EMPTY_RESULTS = Object.freeze([])
  _currentPage = 1
  _endOfStream = false

  constructor ({apiKey, user, pageSize}) {
    let validator = new Validator(FlickrDataSource._CLASS_ID).method('constructor')

    validator.checkString({ apiKey })
    validator.checkString({ user })
    validator.checkNumber({ pageSize })

    this._apiKey = apiKey
    this._user = user
    this._source = `https://www.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&format=json&nojsoncallback=1&extras=url_t,url_s,url_m&api_key=${apiKey}&user_id=${user}&per_page=${pageSize * 2}`
  }

  nextPage () {
    if (this._endOfStream) {
      return Promise.resolve(FlickrDataSource.EMPTY_RESULTS)
    }

    return new Request(`${this._source}&page=${this._currentPage++}`)
      .send()
      .then((response) => {
        let data = JSON.parse(response.text)
        this._endOfStream = !data.photos.photo.length

        Logger.debug('[FlickrCoverflow.FlickrDataSource] - nextPage -', {
          loaded: data.photos.photo.length,
          total: data.photos.total,
          photo: data.photos.photo
        })

        if (!this._endOfStream) {
          return data.photos.photo
        } else {
          return FlickrDataSource.EMPTY_RESULTS
        }
      })
  }

}

export default FlickrDataSource