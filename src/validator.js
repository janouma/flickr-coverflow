export default class Validator {
  #host
  #method
  
  constructor (host = '[Validator]', method = 'check') {
    this.#host = host
    this.#method = method
  }

  method (method) {
    this.#method = method
    return this
  }

  checkDefined (parameter) {
    let name = Object.keys(parameter)[0]
    let value = parameter[name]

    if (value === undefined || value === null) {
      throw Error(`${this.#host} - ${this.#method} - parameter ${name} is required`)
    }
  }

  checkNumber (parameter, possibleValues) {
    let name = Object.keys(parameter)[0]
    let value = parameter[name]

    if (!possibleValues) {
      if (typeof value !== 'number') {
        throw Error(`${this.#host} - ${this.#method} - parameter ${name} is required and must be a number. Actual: ${value}`)
      }
    } else {
      if (possibleValues.indexOf(value) < 0) {
        throw Error(`${this.#host} - ${this.#method} - parameter ${name} must be one of ${possibleValues}. Actual: ${value}`)
      }
    }
  }

  checkString (parameter, possibleValues) {
    let name = Object.keys(parameter)[0]
    let value = parameter[name]

    if (!possibleValues) {
      if (typeof value !== 'string' || !value.trim()) {
        throw Error(`${this.#host} - ${this.#method} - parameter ${name} is required and must be a non-empty string. Actual: ${value}`)
      }
    } else {
      if (possibleValues.indexOf(value) < 0) {
        throw Error(`${this.#host} - ${this.#method} - parameter ${name} must be one of ${possibleValues}. Actual: ${value}`)
      }
    }
  }
}
