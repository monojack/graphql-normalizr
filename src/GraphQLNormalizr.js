import { visit, parse as gql, Kind, } from 'graphql'

import { pluralize, } from './pluralize'
import {
  hasField,
  createField,
  toLists,
  buildNoTypenameError,
  getIn,
} from './helpers'
import {
  map,
  prop,
  isNil,
  isNotNil,
  isArray,
  isObject,
  isScalar,
  toLower,
  toUpper,
  toCamel,
  toSnake,
  toPascal,
  toKebab,
} from './utils'
import {
  CACHE_READ_ERROR,
  CACHE_WRITE_ERROR,
  PAGEINFO_WITH_USE_CONNECTIONS_FALSE,
} from './constants'

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
  useConnections = false,
  typePointers = false,
} = {}) {
  const hasIdField = hasField(idKey)
  const hasTypeNameField = hasField('__typename')
  const hasEdgesField = hasField('edges')

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

  function mapper (...path) {
    const entities = {}
    return typePointers
      ? item => {
        const { __typename: typename, [idKey]: id, } = getIn(item, path, {})
        entities[typename] = getEntityName(typename, entities)
        return { collection: getEntityName(typename, entities), [idKey]: id, }
      }
      : item => getIn(item, path, {})[idKey]
  }

  function mapNestedValue (obj, ignoreKeys) {
    const object = { ...obj, }
    !typenames && delete object.__typename

    const res = Object.entries(object).reduce((acc, [ key, value, ]) => {
      const processKey = !(ignoreKeys && ignoreKeys.includes(key))
      return {
        ...acc,
        [key]: processKey && isObject(value)
          ? useConnections && value.hasOwnProperty('edges')
            ? value.edges.map(mapper('node')).filter(isNotNil)
            : prop(idKey)(value)
          : isArray(value) && !value.every(isScalar)
            ? map(mapper())(value)
            : value,
      }
    }, {})
    return res
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

  function normalize ({ data, ignoreKeys, }) {
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

    let warned = false
    ;(function walk (root, path = '') {
      if (
        root &&
        Object.prototype.hasOwnProperty.call(root, 'pageInfo') &&
        !useConnections
      ) {
        process.env.NODE_ENV !== 'production' &&
          !warned &&
          // eslint-disable-next-line
          console.warn(PAGEINFO_WITH_USE_CONNECTIONS_FALSE)
        warned = true
      }

      for (const [ key, value, ] of Object.entries(root)) {
        const processKey = !(ignoreKeys && ignoreKeys.includes(key))
        if (useConnections && !isNil(value) && value.hasOwnProperty('edges')) {
          walk(value.edges, `${path ? `${path}.` : ``}${key}.edges`)
        } else if (
          processKey && (
            isObject(value) ||
            (isArray(value) && !value.every(isScalar))
          )
        ) {
          const type = value.__typename
          type && (entities[type] = getEntityName(type, entities))

          stack.value = value
          stack.entity = entities[type]

          walk(value, `${path ? `${path}.` : ``}${key}`)
        } else {
          if (!paths[path] && isNotNil(value)) {
            assoc(stack.entity, mapNestedValue(stack.value, ignoreKeys), normalized)
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

    normalized = lists ? toLists(normalized) : normalized

    return normalized
  }

  const connectionFields = [ 'edges', 'pageInfo', ]

  const excludeMetaFields = useConnections
    ? (node, key, parent, path) =>
      hasEdgesField(node.selections) ||
        connectionFields.includes(parent.name.value)
    : () => false

  function addRequiredFields (query) {
    return visit(query, {
      SelectionSet (node, key, parent, path) {
        if (
          parent.kind === Kind.OPERATION_DEFINITION ||
          excludeMetaFields(node, key, parent, path)
        ) {
          return
        }

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
