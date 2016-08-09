class Validator {
  constructor (host = '[Validator]', method = 'check') {
    this._host = host
    this._method = method
  }

  method (method) {
    let validator = Object.create(this)
    validator._method = method
    return validator
  }

  checkDefined (parameter) {
    let name = Object.keys(parameter)[0]
    let value = parameter[name]
    let host = this._host
    let method = this._method

    if (value === undefined || value === null) {
      throw Error(`${host} - ${method} - parameter ${name} is required`)
    }
  }

  checkNumber (parameter, possibleValues) {
    let name = Object.keys(parameter)[0]
    let value = parameter[name]
    let host = this._host
    let method = this._method

    if (!possibleValues) {
      if (typeof value !== 'number') {
        throw Error(`${host} - ${method} - parameter ${name} is required and must be a number. Actual: ${value}`)
      }
    } else {
      if (possibleValues.indexOf(value) < 0) {
        throw Error(`${host} - ${method} - parameter ${name} must be one of ${possibleValues}. Actual: ${value}`)
      }
    }
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
