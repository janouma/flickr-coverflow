const Ø = Object.freeze(Object.create(null))

export default class Signal {
  #listeners
  
  register (listener) {
    if (typeof listener === 'function') {
      (this.#listeners != null ? this.#listeners : (this.#listeners = [])).push(listener)
    }
  }

  unregister (listener) {
    if (this.#listeners) {
      let index = this.#listeners.indexOf(listener)
      if (index >= 0) { return this.#listeners.splice(index, 1) }
    }
  }

  clear () { this.#listeners = undefined }

  send (data) {
    if (this.#listeners) {
      // making a copy of this.#listeners
      // to prevent "unregister()" to mess with listeners notification
      for (let listener of this.#listeners.slice()) {
        listener.call(Ø, data)
      }
    }
  }
}
