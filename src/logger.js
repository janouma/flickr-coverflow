export default new (class Logger {
  #level = 'info'
  
  static #levels = [
    'debug',
    'log',
    'info',
    'warn',
    'error'
  ]
  
  get level () {
    return this.#level
  }
  
  set level (newLevel) {
    let levelIndex
  
    newLevel = ((newLevel && newLevel.trim()) || '').toLowerCase()
  
    if (!newLevel) {
      throw Error(`[FlickrCoverflow.Logger] - set level - level argument must be provided. actual: "${newLevel}"`)
    }
  
    levelIndex = Logger.#levels.indexOf(newLevel)
  
    if (levelIndex < 0) {
      throw Error(`[FlickrCoverflow.Logger] - set level - "${newLevel}" log level is not supported`)
    }
  
    this.#level = newLevel
  
    if (levelIndex > 0) {
      for (let level of Logger.#levels.slice(0, levelIndex)) {
        this[level] = Logger.#noaction
      }
    }
  
    for (let level of Logger.#levels.slice(levelIndex)) {
      this[level] = this.#trace.bind(this, level)
    }
  
    this.info(`[FlickrCoverflow.Logger] - set level - Level has been set to "${newLevel}"`)
  }
  
  constructor () {
    for (let level of Logger.#levels) {
      this[level] = Logger.#noaction
    }
  }
  
  static #noaction() {}
  
  #trace (level, ...params) {
    if (!(level in console)) {
      level = 'log'
    }
    console[level](...params)
  }
})()
