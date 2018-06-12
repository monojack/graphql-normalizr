export const buildNoTypenameError = node =>
  `[GraphQLNormalizr]: No "__typename" field found on node ${JSON.stringify(
    node
  )}`

export const hasField = name => set =>
  set.some(({ name: { value, }, }) => value === name)

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
