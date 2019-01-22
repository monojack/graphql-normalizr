const test = require('ava')
const { visit, print, } = require('graphql')
const gql = require('graphql-tag')

const { GraphQLNormalizr, } = require('../')
const {
  allUsersConnections,
  customIdKey,
  listAndObject,
  listAndObjectConnections,
  listAndObjectConnectionsWithNullNodes,
  mergeTestData,
  nested,
  noNested,
  noTypeNames,
  withScalarArrays,
  withScalarArraysConnections,
  withMultipleTypesConnections,
  typeWithSameTypeFieldsConnections,
  useConnectionsGraphqlQuery,
} = require('./mocks/data')

test('GraphQLNormalizr returns an object with `normalize`, `parse` and `addRequiredFields` methdos', t => {
  const { normalize, parse, addRequiredFields, } = new GraphQLNormalizr()

  t.not(undefined, normalize)
  t.not(undefined, parse)
  t.not(undefined, addRequiredFields)
})

test('`normalize` throws if a node has no `__typename` field', t => {
  const { normalize, } = new GraphQLNormalizr()
  t.throws(() => normalize({ data: noTypeNames, }))
})

test('`normalize` throws if `useConnections` is false and has `pageInfo` field', t => {
  const { normalize, } = new GraphQLNormalizr()
  t.throws(() => normalize({ data: allUsersConnections, }))
})

test('snapshot :: `normalize` correctly handles NULL nodes', t => {
  const { normalize, } = new GraphQLNormalizr({
    useConnections: true,
  })
  t.snapshot(normalize({ data: listAndObjectConnectionsWithNullNodes, }))
})

test('snapshot :: `normalize` simple, not nested data', t => {
  const { normalize, } = new GraphQLNormalizr()
  t.snapshot(normalize({ data: noNested, }))
})

test('snapshot :: `normalize` nested data', t => {
  const { normalize, } = new GraphQLNormalizr()
  t.snapshot(normalize({ data: nested, }))
})

test('snapshot :: `normalize` data containing lists and objects', t => {
  const { normalize, } = new GraphQLNormalizr()
  t.snapshot(normalize({ data: listAndObject, }))
})

test('snapshot :: `normalize` merge data on the same doc', t => {
  const { normalize, } = new GraphQLNormalizr()
  t.snapshot(normalize({ data: mergeTestData, }))
})

test('snapshot :: `normalize` with custom "id" key', t => {
  const { normalize, } = new GraphQLNormalizr({ idKey: '_id', })
  t.snapshot(normalize({ data: customIdKey, }))
})

test('snapshot :: `normalize` with custom entity names', t => {
  const { normalize, } = new GraphQLNormalizr({
    typeMap: { User: 'accounts', BlogPost: 'stories', Comment: 'messages', },
  })
  t.snapshot(normalize({ data: listAndObject, }))
})

test('snapshot :: `normalize` with lists', t => {
  const { normalize, } = new GraphQLNormalizr({
    lists: true,
  })
  t.snapshot(normalize({ data: listAndObject, }))
})

test('snapshot :: `normalize` with typenames', t => {
  const { normalize, } = new GraphQLNormalizr({
    typenames: true,
  })
  t.snapshot(normalize({ data: listAndObject, }))
})

test('snapshot :: `normalize` with scalar arrays', t => {
  const { normalize, } = new GraphQLNormalizr({
    typenames: true,
  })
  t.snapshot(normalize({ data: withScalarArrays, }))
})

test('snapshot :: `normalize` with graphql connections', t => {
  const { normalize, } = new GraphQLNormalizr({
    useConnections: true,
  })
  t.snapshot(normalize({ data: allUsersConnections, }))
})

test('snapshot :: `normalize` with graphql connections and type with same type fields', t => {
  const { normalize, } = new GraphQLNormalizr({
    useConnections: true,
  })
  t.snapshot(normalize({ data: typeWithSameTypeFieldsConnections, }))
})

test('snapshot :: `normalize` with graphql connections and scalar arrays', t => {
  const { normalize, } = new GraphQLNormalizr({
    useConnections: true,
  })
  t.snapshot(normalize({ data: withScalarArraysConnections, }))
})

test('snapshot :: `normalize` with graphql connections and custom entity names', t => {
  const { normalize, } = new GraphQLNormalizr({
    useConnections: true,
    typeMap: { User: 'accounts', BlogPost: 'stories', Comment: 'messages', },
  })
  t.snapshot(normalize({ data: listAndObjectConnections, }))
})

test('snapshot :: `normalize` without graphql connections but `useConnections` flag set to true', t => {
  const { normalize, } = new GraphQLNormalizr({
    useConnections: true,
  })
  t.snapshot(normalize({ data: listAndObject, }))
})

test('snapshot :: `normalize` without graphql connections but `useConnections` flag set to true and scalar array', t => {
  const { normalize, } = new GraphQLNormalizr({
    useConnections: true,
  })
  t.snapshot(normalize({ data: withScalarArrays, }))
})

test('snapshot :: `normalize` without graphql connections but `useConnections` flag set to true and custom entity names', t => {
  const { normalize, } = new GraphQLNormalizr({
    useConnections: true,
    typeMap: { User: 'accounts', BlogPost: 'stories', Comment: 'messages', },
  })
  t.snapshot(normalize({ data: listAndObject, }))
})

test('snapshot :: `normalize` with `{ plural: false }`', t => {
  const { normalize, } = new GraphQLNormalizr({
    plural: false,
  })
  t.snapshot(normalize({ data: listAndObject, }))
})

test('snapshot :: `normalize` with `{ casing: "lower" }`', t => {
  const { normalize, } = new GraphQLNormalizr({
    casing: 'lower',
  })
  t.snapshot(normalize({ data: listAndObject, }))
})

test('snapshot :: `normalize` with `{ casing: "upper" }`', t => {
  const { normalize, } = new GraphQLNormalizr({
    casing: 'upper',
  })
  t.snapshot(normalize({ data: listAndObject, }))
})

test('snapshot :: `normalize` with `{ casing: "camel" }`', t => {
  const { normalize, } = new GraphQLNormalizr({
    casing: 'camel',
  })
  t.snapshot(normalize({ data: listAndObject, }))
})

test('snapshot :: `normalize` with `{ casing: "pascal" }`', t => {
  const { normalize, } = new GraphQLNormalizr({
    casing: 'pascal',
  })
  t.snapshot(normalize({ data: listAndObject, }))
})

test('snapshot :: `normalize` with `{ casing: "kebab" }`', t => {
  const { normalize, } = new GraphQLNormalizr({
    casing: 'kebab',
  })
  t.snapshot(normalize({ data: listAndObject, }))
})

test('snapshot :: `normalize` with `{ casing: "snake" }`', t => {
  const { normalize, } = new GraphQLNormalizr({
    casing: 'snake',
  })
  t.snapshot(normalize({ data: listAndObject, }))
})

test('snapshot :: `normalize` with { useConnections: true, unionTypes: true }', t => {
  const { normalize, } = new GraphQLNormalizr({
    useConnections: true,
    unionTypes: true,
  })
  t.snapshot(normalize({ data: withMultipleTypesConnections, }))
})

test('snapshot :: `parse` with { useConnections: false }', t => {
  const { parse, } = new GraphQLNormalizr({
    useConnections: false,
  })
  t.snapshot(print(parse(useConnectionsGraphqlQuery)))
})

test('snapshot :: `parse` with { useConnections: true }', t => {
  const { parse, } = new GraphQLNormalizr({
    useConnections: true,
  })
  t.snapshot(print(parse(useConnectionsGraphqlQuery)))
})

test('`normalize` with cache', t => {
  let normalize

  normalize = new GraphQLNormalizr().normalize
  const data = normalize({ data: listAndObject, })
  const newData = normalize({ data: listAndObject, })
  t.not(data, newData)

  normalize = new GraphQLNormalizr({ caching: true, }).normalize
  const _data = normalize({ data: listAndObject, })
  const _newData = normalize({ data: listAndObject, })
  t.is(_data, _newData)
})

test('`parse` adds the required ["id", "__typename"] fields', t => {
  const query = `{
    allUsers {
      email
    }
    allPosts {
      author
      comments {
        message
        author
      }
    }
  }
  `

  let documentAST = gql(query)

  let bool = false
  visit(documentAST, {
    SelectionSet (node, parent) {
      bool = node.selections.some(s =>
        [ 'id', '__typename', ].includes(s.name.value)
      )
    },
  })
  t.false(bool)

  bool = false
  const { parse, } = new GraphQLNormalizr()
  documentAST = parse(query)
  visit(documentAST, {
    SelectionSet (node, parent) {
      bool = node.selections.some(s =>
        [ 'id', '__typename', ].includes(s.name.value)
      )
    },
  })
  t.true(bool)
})
