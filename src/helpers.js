export const buildNoTypenameError = node =>
  `[GraphQLNormalizr]: No "__typename" field found on node ${JSON.stringify(
    node
  )}`

export const hasField = fieldName => set =>
  set.some(({ alias, name, }) => (alias || name).value === fieldName)

export const createField = name => ({
  kind: 'Field',
  alias: undefined,
  name: {
    kind: 'Name',
    value: name,
  },
  arguments: [],
  directives: [],
  selectionSet: undefined,
})

export const toLists = (object = {}) =>
  Object.entries(object).reduce(
    (acc, [ key, value, ]) => ({
      ...acc,
      [key]: Object.values(value),
    }),
    {}
  )

export const getIn = (obj, keys, defaultValue) => {
  let result = obj
  let index = 0
  while (index < keys.length && result != null) {
    result = result[keys[index]]
    index += 1
  }
  return keys.length === index && result !== undefined ? result : defaultValue
}
