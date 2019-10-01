# **graphql-normalizr**

[![Build Status](https://travis-ci.org/monojack/graphql-normalizr.svg?branch=master)](https://travis-ci.org/monojack/graphql-normalizr)
[![npm version](https://img.shields.io/npm/v/graphql-normalizr.svg)](https://www.npmjs.com/package/graphql-normalizr)
[![npm downloads](https://img.shields.io/npm/dm/graphql-normalizr.svg)](https://www.npmjs.com/package/graphql-normalizr)
[![minified size](https://badgen.net/bundlephobia/min/graphql-normalizr)](https://bundlephobia.com/result?p=graphql-normalizr@latest)

Normalize GraphQL responses for persisting in the client cache/state.

> Not related, in any way, to [normalizr](https://github.com/paularmstrong/normalizr), just shamelessly piggybacking on it's popularity. Also, "normaliz**E**r" is taken...

**TL;DR**: Transforms:

```json
{
  "data": {
    "findUser": [
      {
        "__typename": "User",
        "id": "5a6efb94b0e8c36f99fba013",
        "email": "Lloyd.Nikolaus@yahoo.com",
        "posts": [
          {
            "__typename": "BlogPost",
            "id": "5a6efb94b0e8c36f99fba016",
            "title": "Dolorem voluptatem molestiae",
            "comments": [
              {
                "__typename": "Comment",
                "id": "5a6efb94b0e8c36f99fba019",
                "message": "Alias quod est voluptatibus aut quis sunt aut numquam."
              },
              {
                "__typename": "Comment",
                "id": "5a6efb94b0e8c36f99fba01b",
                "message": "Harum quia asperiores nemo."
              },
              {
                "__typename": "Comment",
                "id": "5a6efb94b0e8c36f99fba01c",
                "message": "Vel veniam consectetur laborum."
              },
              {
                "__typename": "Comment",
                "id": "5a6efb94b0e8c36f99fba01e",
                "message": "Possimus beatae vero recusandae beatae quas ut commodi laboriosam."
              }
            ]
          }
        ]
      }
    ]
  }
}
```

into:

```json
{
  "comments": {
    "5a6efb94b0e8c36f99fba019": {
      "id": "5a6efb94b0e8c36f99fba019",
      "message": "Alias quod est voluptatibus aut quis sunt aut numquam."
    },
    "5a6efb94b0e8c36f99fba01b": {
      "id": "5a6efb94b0e8c36f99fba01b",
      "message": "Harum quia asperiores nemo."
    },
    "5a6efb94b0e8c36f99fba01c": {
      "id": "5a6efb94b0e8c36f99fba01c",
      "message": "Vel veniam consectetur laborum."
    },
    "5a6efb94b0e8c36f99fba01e": {
      "id": "5a6efb94b0e8c36f99fba01e",
      "message": "Possimus beatae vero recusandae beatae quas ut commodi laboriosam."
    }
  },
  "blogPosts": {
    "5a6efb94b0e8c36f99fba016": {
      "id": "5a6efb94b0e8c36f99fba016",
      "title": "Dolorem voluptatem molestiae",
      "comments": [
        "5a6efb94b0e8c36f99fba019",
        "5a6efb94b0e8c36f99fba01b",
        "5a6efb94b0e8c36f99fba01c",
        "5a6efb94b0e8c36f99fba01e"
      ]
    }
  },
  "users": {
    "5a6efb94b0e8c36f99fba013": {
      "id": "5a6efb94b0e8c36f99fba013",
      "email": "Lloyd.Nikolaus@yahoo.com",
      "posts": ["5a6efb94b0e8c36f99fba016"]
    }
  }
}
```

## Motivation

We all love **GraphQL** and we want to use it. There are tons of libraries and clients out there that help us do that with ease, but there is still one problem... How do you persist that data?

Yes, everything is all great when the response mirrors the exact structure we asked for, but we don't want to cache it that way, do we? We probably want a normalized version of that data which we can persist to our store and read/modify it efficiently. Flux or Redux stores work best with normalized data and there are also GraphQL clients you can use to execute queries on the local cache/state ([blips](https://github.com/monojack/blips) or [apollo-link-state](https://github.com/apollographql/apollo-link-state)), in which case, we definitely need to persist normalized data.

**GraphQLNormalizr** is simple, fast, light-weight and it provides all the tools needed to do just that, the only requirement is that you include the `id` and `__typename` fields for all the nodes _(but it can do that for you if you're too lazy or you want to keep your sources thin)_.

## Table of contents

- [**graphql-normalizr**](#graphql-normalizr)
  - [Motivation](#motivation)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
  - [API by example](#api-by-example)
    - [GraphQLNormalizr](#graphqlnormalizr)
        - [idKey](#idkey)
        - [useConnections](#useconnections)
        - [typeMap](#typemap)
        - [plural](#plural)
        - [casing](#casing)
        - [lists](#lists)
        - [typenames](#typenames)
        - [typePointers](#typepointers)
        - [caching](#caching)
    - [`parse`](#parse)
    - [`addRequiredFields`](#addrequiredfields)
    - [`normalize`](#normalize)
  - [Migrating](#migrating)

## Installation

```sh
npm install graphql-normalizr
```

## API by example

The **GraphQLNormalizr** constructor function returns an object containing 1 method:

1.  [normalize](#normalize)

The library itself exports 2 more methods:

1. [parse](#parse)
2. [addRequiredFields](#addrequiredfields)

Depending on how you write your queries, you may or may not use `parse` or `addRequiredFields`, but `normalize` is the method that you will transform the GraphQL response. As you've probably seen from the **TL;DR**, all response nodes must contain the `__typename` and `id` fields. `__typename` is a [GraphQL meta field](http://graphql.org/learn/queries/#meta-fields) and the `id` key may be customized when creating the GraphQLNormalizr client.

If your queries already ask for `id` and `__typename` there's no need to use **parse** or **addRequiredFields**. Otherwise, **parse** will take care of transforming your `GraphQL source` into a `Document` and add the `__typename` and `id` fields where needed. In case you already use a different parser, or only have access to the `Document` you may use **addRequiredFields** on the `Document` to add the `__typename` and `id` fields

### GraphQLNormalizr

```js
import { GraphQLNormalizr } from 'graphql-normalizr'

// const config = ...
const normalizer = new GraphQLNormalizr(config)
```

**config**: optional - the configuration object containing information for instantiating the client. it takes the following props:

- [**graphql-normalizr**](#graphql-normalizr)
  - [Motivation](#motivation)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
  - [API by example](#api-by-example)
    - [GraphQLNormalizr](#graphqlnormalizr)
        - [idKey](#idkey)
        - [useConnections](#useconnections)
        - [typeMap](#typemap)
        - [plural](#plural)
        - [casing](#casing)
        - [lists](#lists)
        - [typenames](#typenames)
        - [typePointers](#typepointers)
        - [caching](#caching)
    - [`parse`](#parse)
    - [`addRequiredFields`](#addrequiredfields)
    - [`normalize`](#normalize)
  - [Migrating](#migrating)

##### idKey

> String

Default is **"id"**. Configures a custom `id` key for the client. Use this if your resource identifiers are found under a different key name _('\_id', 'key', 'uid' etc)_.

Consider the following GraphQL response:

```js
const response = {
  data: {
    findUser: {
      __typename: 'User',
      uid: '5a6efb94b0e8c36f99fba013',
      email: 'Lloyd.Nikolaus@yahoo.com',
    },
  },
}
```

Normalize the data with our custom `id` key:

```js
// using destructuring to get the `normalize` method of the client
const { normalize } = new GraphQLNormalizr({ idKey: 'uid' })
normalize(response)
// =>
// {
//  users: {
//    '5a6efb94b0e8c36f99fba013' : {
//      uid: '5a6efb94b0e8c36f99fba013',
//      email: 'Lloyd.Nikolaus@yahoo.com'
//    }
//  }
// }
```

##### useConnections

> Boolean

Default is `false`. If you are using GraphQL connections with `edges` and `nodes`, set this flag to **`true`** otherwise you'll get a warning and the normalization won't work.

**NOTE**: _The connections implementation needs to be according to the [specification](https://facebook.github.io/relay/graphql/connections.htm)_

```js
const response = {
  data: {
    findUser: {
      __typename: 'User',
      id: '5a6efb94b0e8c36f99fba013',
      email: 'Lloyd.Nikolaus@yahoo.com',
      friends: {
        __typename: 'FriendsConnection',
        totalCount: 3,
        edges: [
          {
            node: {
              __typename: 'User',
              id: '5a6cf127c2b20834f6551481',
              email: 'Madisen_Braun@hotmail.com',
            },
            cursor: 'Y3Vyc29yMg==',
          },
          {
            node: {
              __typename: 'User',
              id: '5a6cf127c2b20834f6551482',
              email: 'Robel.Ansel@yahoo.com',
            },
            cursor: 'Y3Vyc29yMw==',
          },
        ],
        pageInfo: {
          endCursor: 'Y3Vyc29yMw==',
          hasNextPage: false,
        },
      },
    },
  },
}

const { normalize } = new GraphQLNormalizr({
  useConnections: true,
})

normalize(response)
// =>
// {
//   users: {
//     '5a6efb94b0e8c36f99fba013': {
//       id: '5a6efb94b0e8c36f99fba013',
//       email: 'Lloyd.Nikolaus@yahoo.com',
//       friends: ['5a6cf127c2b20834f6551481', '5a6cf127c2b20834f6551482'],
//     },
//     '5a6cf127c2b20834f6551481': {
//       id: '5a6cf127c2b20834f6551481',
//       email: 'Madisen_Braun@hotmail.com',
//     },
//     '5a6cf127c2b20834f6551482': {
//       id: '5a6cf127c2b20834f6551482',
//       email: 'Robel.Ansel@yahoo.com',
//     },
//   },
// }
```

##### typeMap

> Object

By default **the entity name will be the plural form of the type name, converted to camel case**, _(`PrimaryAddress` type will be stored under the `primaryAddresses` key)_. Use this option to provide specific **entity** names for some/all **Types**, or try the [plural](#plural) and [casing](#casing) options to derive the entity names.

```js
const response = {
  data: {
    findUser: {
      __typename: 'User',
      id: '5a6efb94b0e8c36f99fba013',
      email: 'Lloyd.Nikolaus@yahoo.com',
    },
  },
}

const { normalize } = new GraphQLNormalizr({
  typeMap: { User: 'accounts' },
})
normalize(response)
// =>
// {
//  accounts: {
//    '5a6efb94b0e8c36f99fba013' : {
//      id: '5a6efb94b0e8c36f99fba013',
//      email: 'Lloyd.Nikolaus@yahoo.com'
//    }
//  }
// }
```

##### plural

> Boolean

Default is `true`. Set this to `false` if you don't want to [pluralize](https://github.com/blakeembrey/pluralize) entity names. Considering the previous response example:

```js
const { normalize } = new GraphQLNormalizr({
  plural: false,
})
normalize(response)
// =>
// {
//  user: {
//    '5a6efb94b0e8c36f99fba013' : {
//      id: '5a6efb94b0e8c36f99fba013',
//      email: 'Lloyd.Nikolaus@yahoo.com'
//    }
//  }
// }
```

##### casing

> 'lower'|'upper'|'camel'|'pascal'|'snake'|'kebab'

You can also specify the preferred casing for entity names. Again, consider the above response example.

```js
// casing: 'lower'
// User => user

// casing: 'upper'
// User => USER

// casing: 'camel'
// PrimaryAddress => primaryAddress

// casing: 'pascal'
// PrimaryAddress => PrimaryAddress

// casing: 'snake'
// PrimaryAddress => primary_address

// casing: 'kebab'
// PrimaryAddress => primary-address
```

Combine `plural` and `casing` options to get the desired entity names

##### lists

> Boolean

Default is `false`. All the data is stored in key/value pairs, for easy access. If you want to use arrays, for whatever reason, set this to `true`

For the same response object in our previous example:

```js
const { normalize } = new GraphQLNormalizr({
  lists: true,
})
normalize(response)
// =>
// {
//  users: [
//    {
//      id: '5a6efb94b0e8c36f99fba013',
//      email: 'Lloyd.Nikolaus@yahoo.com'
//    }
//  ]
// }
```

##### typenames

> Boolean

Default is `false`. The normalized data will not contain the `__typename` field. Set this to `true` if you need to persist them.

```js
const { normalize } = new GraphQLNormalizr({
  typenames: true,
})

normalize(response)
// =>
// {
//  users: {
//    '5a6efb94b0e8c36f99fba013' : {
//      __typename: 'User',
//      id: '5a6efb94b0e8c36f99fba013',
//      email: 'Lloyd.Nikolaus@yahoo.com'
//    }
//  }
// }
```

##### typePointers

> Boolean

Default is `false`. Enables explicit type pointers - instead of an array of only identifiers and having to figure out which collection they point to, it will return objects containing the identifier as well as the collection name. Works especially well with Union types and Interfaces.

```js

const { normalize } = new GraphQLNormalizr({
  typePointers: true,
})

// ['5a6cf127c2b20834f655148a', '5a6cf127c2b20834f655148b', '5a6cf127c2b20834f655148c']
users: [
  {
    _id: '5a6cf127c2b20834f655148a', // '_id' or the specified key
    collection: 'members', // type Member
  },
  {
    _id: '5a6cf127c2b20834f655148b', // '_id' or the specified key
    collection: 'authors', // type Author
  },
  {
    _id: '5a6cf127c2b20834f655148c', // '_id' or the specified key
    collection: 'members', // type Member
  },
],
```

##### caching

> Boolean

Default is `false`. The **normalize** method is pretty fast by itself, it does a single iteration and associates the values only for each response node and not for all the fields. Enable this if you think you'd be normalizing the same response multiple times, like when you're polling for data and it may not have changed.

```js
const { normalize } = new GraphQLNormalizr({
  caching: true,
})

const normalized = normalize(response)
const cached = normalize(response)

cached === normalized // => true
```

### `parse`

Turns a **GraphQL source** into a **Document** and adds the required fields where necessary.

Arguments:
| argument  | default | required | type |
| ------------------ | ------------- | ------------- | ----------------- |
| source  			 | undefined  	 |	yes			 |	string			 |
| useConnections  	 | false  		 |	no		     |		boolean		 |
| idKey  		     | id  			 |	no		     |		string		 |

```js
// ...
import { parse } from 'graphql-normalizr'

const source = `{
  allUsers {
    email
    posts {
      title
      comments {
        message
      }
    }
  }
}`

const query = parse(source) // will add `id` and `__typename` fields to all the nodes

// We can use the print method from `graphql` to see/use the updated source
const { print } = require('graphql')
print(query)
// =>
// `{
//  allUsers {
//    __typename
//    id
//    email
//    posts {
//      __typename
//      id
//      comments {
//        __typename
//        id
//        message
//      }
//    }
//  }
// }`

// ...
```

### `addRequiredFields`

Arguments:
| argument  | default | required | type |
| ------------------ | ------------- | ------------- | ----------------- |
| query  			 | undefined  	 |	yes			 |	GraphQL AST Tree |
| useConnections  	 | false  		 |	no		     |		boolean		 |
| idKey  		     | id  			 |	no		     |		string		 |

If you only have access to the **Document**, you can use the **print** method from `graphql` to get the **source** and parse it. But that may be expensive and you shouldn't have to print a document just to parse it again. `addRequiredFields` will add the `id` and `__typename` fields to that document, without the need of extracting it's source.

```js
// ...
import { addRequiredFields } from 'graphql-normalizr'
import { allUsersQuery } from './queries'

const query = addRequiredFields(allUsersQuery)

// ...
```

### `normalize`

The following is a full example where we use [apollo-fetch](https://github.com/apollographql/apollo-fetch/tree/master/packages/apollo-fetch) to execute a query and then normalize it with **GraphQLNormalizr**

```js
const { GraphQLNormalizr, parse } = require('graphql-normalizr')
const { createApolloFetch } = require('apollo-fetch')

const uri = 'http://localhost:8080/graphql'
const fetch = createApolloFetch({ uri })

const source = `
  query {
    allUsers {
      ...userFields
    }
  }
  fragment userFields on User {
    email
    posts {
      title
      comments {
        message
      }
    }
  }
`

const { normalize } = new GraphQLNormalizr()
const query = parse(source)

fetch({ query }).then(response => {
  const normalized = normalize(response)
  // persist the normalized data to our app state.
}).catch(...)
```

## Migrating

**from _v1.x_ to _v2.x_**

There aren't many breaking changes between v1.x and v2.x. In fact, there's only one and it's about how **Type** names get converted into **entity** names.

With the default configuration, v1.x will transfrom a `PrimaryAddress` type name into `primaryaddresses` entity name. With 2.x, the default configuiration will transform `PrimaryAddress` to `primaryAddresses`. The only difference is that now, it changes to _camelcase_ instead of _lowercase_

If you don't want to change your code everywhere you are accessing entities, you can configure the way **GraphQLNormalizr** makes the transformation with the [plural](#plural) and [casing](#casing) options:

```js
const { normalize } = new GraphQLNormalizr({
  plural: true, // true is the default value, so you can omit this
  casing: 'lower',
})

// this above configuration will change `PrimaryAddress` to `primaryaddresses`
```
