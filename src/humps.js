/**
 * https://github.com/domchristie/humps
 */

/* eslint-disable no-self-compare, no-useless-escape */
const _isNumerical = function (obj) {
  obj = obj - 0
  return obj === obj
}

const separateWords = function (string, options) {
  options = options || {}
  var separator = options.separator || '_'
  var split = options.split || /(?=[A-Z])/

  return string.split(split).join(separator)
}

export const camelize = function (string) {
  if (_isNumerical(string)) {
    return string
  }
  string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
    return chr ? chr.toUpperCase() : ''
  })
  // Ensure 1st char is always lowercase
  return string.substr(0, 1).toLowerCase() + string.substr(1)
}

export const pascalize = function (string) {
  var camelized = camelize(string)
  // Ensure 1st char is always uppercase
  return camelized.substr(0, 1).toUpperCase() + camelized.substr(1)
}

export const decamelize = function (string, options) {
  return separateWords(string, options).toLowerCase()
}
