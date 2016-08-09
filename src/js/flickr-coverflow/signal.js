const Ø = Object.freeze(Object.create(null))

class Signal {
  register (listener) {
    if (typeof listener === 'function') {
      (this._listeners != null ? this._listeners : (this._listeners = [])).push(listener)
    }
  }

  unregister (listener) {
    if (this._listeners) {
      let index = this._listeners.indexOf(listener)
      if (index >= 0) { return this._listeners.splice(index, 1) }
    }
  }

  clear () { this._listeners = undefined }

  send (data) {
    if (this._listeners) {
      // making a copy of this._listeners
      // to prevent "unregister()" to mess with listeners notification
      for (let listener of this._listeners.slice()) {
        listener.call(Ø, data)
      }
    }
  }
}

export default Signal
