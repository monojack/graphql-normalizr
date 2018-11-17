import { camelize, decamelize, pascalize, } from './humps'

export function typeOf (value) {
  return Object.prototype.toString.call(value).slice(8, -1)
}

export function isType (type) {
  return function (value) {
    if (value === null) return type.toLowerCase() === 'null'
    if (typeof value === 'undefined') return type.toLowerCase() === 'undefined'

    return type.toLowerCase() === typeOf(value).toLowerCase()
  }
}

export function isArray (value) {
  return isType('array')(value)
}

export function isObject (value) {
  return isType('object')(value)
}

export function isEmpty (value) {
  if (typeof value === 'string') return !value
  if (isType('object', value)) return !Object.values(value).length
  if (isType('array', value)) return !value.length
  if (isType('Map', value)) return !value.size
  if (isType('Set', value)) return !value.size
  return false
}

export function isNil (value) {
  return value == null
}

export function prop (path) {
  return function (obj) {
    return path.split('.').reduce((acc, curr) => {
      try {
        return typeof acc[curr] !== 'undefined' ? acc[curr] : undefined
      } catch (e) {
        return undefined
      }
    }, obj)
  }
}

export function map (transform) {
  return function (list) {
    return list.map(transform)
  }
}

export function mapObject (transform) {
  return function (obj) {
    return Object.entries(obj).reduce(
      (acc, [ key, value, ]) => ({
        ...acc,
        [key]: transform(value),
      }),
      {}
    )
  }
}

export function toLower (str) {
  return str.toLowerCase()
}

export function toUpper (str) {
  return str.toUpperCase()
}

export const toCamel = camelize
export const toSnake = decamelize
export const toPascal = pascalize

export function toKebab (str) {
  return decamelize(str).replace(/_/g, '-')
}

export function isScalar (value) {
  return !isObject(value) && !isNil(value)
}
