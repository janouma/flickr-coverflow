class Validator {
  constructor (host = '[Validator]', method = 'check') {
    this._host = host
    this._method = method
  }

  checkString (parameter, possibleValues) {
    let name = Object.keys(parameter)[0]
    let value = parameter[name]
    let host = this._host
    let method = this._method

    if (!possibleValues) {
      if (typeof value !== 'string' || !value.trim()) {
        throw Error(`${host} - ${method} - parameter ${name} is required and must be a non-empty string. Actual: ${value}`)
      }
    } else {
      if (possibleValues.indexOf(value) < 0) {
        throw Error(`${host} - ${method} - parameter ${name} must be one of ${possibleValues}. Actual: ${value}`)
      }
    }
  }
}

export default Validator
