import Logger from './logger'
import Validator from './validator'

const EXTRAS = [
  'url_t',
  'url_s',
  'url_m',
  'url_n',
  'url_w',
  'url_z',
  'url_c',
  'url_b',
  'description'
]

export default class FlickrDataSource {
  static #CLASS_ID = `[flickr-coverflow/${this.name}]`
  static EMPTY_RESULTS = Object.freeze([])
  #currentPage = 1
  #endOfStream = false
  #apiKey
  #user
  #source
  #pageSize
  
  get pageSize () {
    return this.#pageSize
  }

  constructor ({ apiKey, user, pageSize }) {
    let validator = new Validator(FlickrDataSource.#CLASS_ID).method('constructor')

    validator.checkString({ apiKey })
    validator.checkString({ user })
    validator.checkNumber({ pageSize })

    this.#apiKey = apiKey
    this.#user = user
    this.#pageSize = pageSize
    this.#source = `https://www.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&format=json&nojsoncallback=1&extras=${EXTRAS.join(',')}&api_key=${apiKey}&user_id=${user}&per_page=${pageSize * 2}`
  }

  async nextPage () {
    if (this.#endOfStream) {
      return FlickrDataSource.EMPTY_RESULTS
    }
    
    const response = await fetch(`${this.#source}&page=${this.#currentPage++}`)
    const data = await response.json()
    this.#endOfStream = !data.photos.photo.length
    
    Logger.debug('[FlickrCoverflow.FlickrDataSource] - nextPage -', {
      loaded: data.photos.photo.length,
      total: data.photos.total,
      photo: data.photos.photo
    })
    
    return !this.#endOfStream ? data.photos.photo : FlickrDataSource.EMPTY_RESULTS
  }
}
