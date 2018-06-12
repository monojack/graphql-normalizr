import pluralize from 'pluralize'
import { visit, parse as gql, Kind, } from 'graphql'

import { hasField, createField, toLists, buildNoTypenameError, } from './helpers'
import {
  map,
  prop,
  isNil,
  isArray,
  isObject,
  toLower,
  toUpper,
  toCamel,
  toSnake,
  toPascal,
  toKebab,
} from './utils'
import { CACHE_READ_ERROR, CACHE_WRITE_ERROR, } from './constants'

const casingMethodMap = {
  lower: toLower,
  upper: toUpper,
  kebab: toKebab,
  camel: toCamel,
  pascal: toPascal,
  snake: toSnake,
}

export function GraphQLNormalizr ({
  idKey = 'id',
  typeMap = {},
  caching = false,
  lists = false,
  typenames = false,
  plural = true,
  casing = 'camel',
} = {}) {
  const hasIdField = hasField(idKey)
  const hasTypeNameField = hasField('__typename')

  const idField = createField(idKey)
  const typeNameField = createField('__typename')

  const cache = new Map()

  function caseTransform (type) {
    let str = type
    str = plural ? pluralize(str) : str
    str = casingMethodMap[casing](str)
    return str
  }

  function getEntityName (type, entities) {
    return typeMap[type] || entities[type] || caseTransform(type)
  }

  function mapNestedValue (obj) {
    const object = { ...obj, }
    !typenames && delete object.__typename

    return Object.entries(object).reduce((acc, [ key, value, ]) => {
      return {
        ...acc,
        [key]: isObject(value)
          ? prop(idKey)(value)
          : isArray(value) ? map(prop(idKey))(value) : value,
      }
    }, {})
  }

  function assoc (entity, value, normalized) {
    if (isNil(entity)) throw new Error(buildNoTypenameError(value))
    const id = value[idKey]

    const existingEntities = normalized[entity]
    normalized[entity] = existingEntities || {}

    const existing = normalized[entity][id] || {}
    normalized[entity][id] = {
      ...existing,
      ...value,
    }
  }

  function normalize ({ data, }) {
    const paths = {}
    const entities = {}
    const stack = {}
    let normalized = {}

    try {
      let cached
      caching && (cached = cache.get(JSON.stringify(data)))
      if (cached) {
        return cached
      }
    } catch (e) {
      // eslint-disable-next-line
      process.env.NODE_ENV !== 'production' && console.warn(CACHE_READ_ERROR)
    }

    ;(function visit (root, path = '') {
      for (const [ key, value, ] of Object.entries(root)) {
        if (isObject(value) || isArray(value)) {
          const type = value.__typename
          type && (entities[type] = getEntityName(type, entities))

          stack.value = value
          stack.entity = entities[type]

          visit({ ...value, }, `${path ? `${path}.` : ``}${key}`)
        } else {
          if (!paths[path]) {
            assoc(stack.entity, mapNestedValue(stack.value), normalized)
            paths[path] = { done: true, }
          }
        }
      }
    })(data)

    try {
      caching && cache.set(JSON.stringify(data), normalized)
    } catch (e) {
      // eslint-disable-next-line
      process.env.NODE_ENV !== 'production' && console.warn(CACHE_WRITE_ERROR)
    }

    normalized = lists ? toLists(normalized) : normalized || {}

    return normalized
  }

  function addRequiredFields (query) {
    return visit(query, {
      SelectionSet (node, key, parent, path) {
        if (parent.kind === Kind.OPERATION_DEFINITION) return

        !hasIdField(node.selections) && node.selections.unshift(idField)
        !hasTypeNameField(node.selections) &&
          node.selections.unshift(typeNameField)

        return node
      },
    })
  }

  function parse (qs) {
    return addRequiredFields(gql(qs, { noLocation: true, }))
  }

  return { normalize, addRequiredFields, parse, }
}
