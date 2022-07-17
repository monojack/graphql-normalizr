import { visit, parse as gql, Kind, } from 'graphql'

import { pluralize, } from './pluralize'
import { hasField, createField, toLists, buildNoTypenameError, getIn, } from './helpers'
import {
  map,
  prop,
  isNil,
  isNotNil,
  isArray,
  isObject,
  isEmpty,
  isScalar,
  toLower,
  toUpper,
  toCamel,
  toSnake,
  toPascal,
  toKebab,
} from './utils'
import { CACHE_READ_ERROR, CACHE_WRITE_ERROR, PAGEINFO_WITH_USE_CONNECTIONS_FALSE, } from './constants'

const isProd = process?.env?.NODE_ENV === 'production'
const warnings = {}
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
  exclude,
  ignore
} = {}) {
  if(!isProd && !warnings.excludeDeprecation && exclude) {
    warnings.excludeDeprecation = true
    console.warn('[GraphQLNormalizr]: The `exclude` option is deprecated and may be removed in the future,\nplease use `ignore` instead.\n(see https://github.com/monojack/graphql-normalizr/issues/38)')
  }
  ignore = ignore || exclude || {}

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

  function mapNestedValue (obj) {
    const object = { ...obj, }
    !typenames && delete object.__typename

    const res = Object.entries(object).reduce((acc, [ key, value, ]) => {
      return {
        ...acc,
        [key]: isObject(value)
          ? useConnections && value.hasOwnProperty('edges')
            ? value.edges.map(mapper('node')).filter(isNotNil)
            : (() => {
              const _v = prop(idKey)(value)
              const { __typename, ..._value } = value
              return _v == null ? (!typenames ? _value : value) : _v
            })()
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

    if (isNil(id)) return

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
    let normalized = {}

    try {
      let cached
      caching && (cached = cache.get(JSON.stringify(data)))
      if (cached) {
        return cached
      }
    } catch (e) {
      !isProd && console.warn(CACHE_READ_ERROR)
    }

    ;(function walk (root, path = '', stackEntity, stackValue) {
      if (root && Object.prototype.hasOwnProperty.call(root, 'pageInfo') && !useConnections) {
        if(!isProd && !warnings.pageInfoNoConnections) {
          console.warn(PAGEINFO_WITH_USE_CONNECTIONS_FALSE)
          warnings.pageInfoNoConnections = true
        }
      }

      for (const [ key, value, ] of Object.entries(root)) {
        if (useConnections && !isNil(value) && value.hasOwnProperty('edges')) {
          value.edges.forEach((edge, i) => {
            if (edge && edge.node) {
              walk({ node: edge.node, }, `${path ? `${path}.` : ``}${key}.edges.${i}`)
            }
          })
        } else if ((isObject(value) || isArray(value)) && isEmpty(value)) {
          paths[path] = { done: true, }
        } else if (isObject(value) || (isArray(value) && !value.every(isScalar))) {
          if (ignore[stackEntity] && ignore[stackEntity].includes(key)) {
            paths[path] = { done: true, }
          } else {
            const type = value.__typename
            type && (entities[type] = getEntityName(type, entities))
            walk(value, `${path ? `${path}.` : ``}${key}`, entities[type], value)
          }
        } else {
          if (!paths[path] && isNotNil(value)) {
            assoc(stackEntity, mapNestedValue(stackValue), normalized)
            paths[path] = { done: true, }
          }
        }
      }
    })(data)

    try {
      caching && cache.set(JSON.stringify(data), normalized)
    } catch (e) {
      // eslint-disable-next-line
      !isProd && console.warn(CACHE_WRITE_ERROR)
    }

    normalized = lists ? toLists(normalized) : normalized

    return normalized
  }

  const isInlineFragment = node => node.kind === Kind.INLINE_FRAGMENT

  const connectionFields = [ 'edges', 'pageInfo', ]

  const excludeMetaFields = useConnections
    ? (node, key, parent, path) =>
      node.selections.some(isInlineFragment) ||
        hasEdgesField(node.selections) ||
        (!isInlineFragment(parent) && connectionFields.includes(parent.name.value))
    : () => false

  function addRequiredFields (query) {
    return visit(query, {
      SelectionSet (node, key, parent, path) {
        if (parent.kind === Kind.OPERATION_DEFINITION || excludeMetaFields(node, key, parent, path)) {
          return
        }

        !hasIdField(node.selections) && node.selections.unshift(idField)
        !hasTypeNameField(node.selections) && node.selections.unshift(typeNameField)

        return node
      },
    })
  }

  function parse (qs) {
    return addRequiredFields(gql(qs, { noLocation: true, }))
  }

  return { normalize, addRequiredFields, parse, }
}
