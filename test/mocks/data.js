const customIdKey = {
  allUsers: [
    {
      __typename: 'User',
      _id: '5a6cf127c2b20834f6551481',
      email: 'Madisen_Braun@hotmail.com',
      posts: [
        {
          __typename: 'BlogPost',
          _id: '5a6cf127c2b20834f6551483',
          title: 'Aut aut reiciendis',
        },
        {
          __typename: 'BlogPost',
          _id: '5a6cf127c2b20834f6551485',
          title: 'Nesciunt esse',
        },
      ],
    },
    {
      __typename: 'User',
      _id: '5a6cf127c2b20834f6551482',
      email: 'Robel.Ansel@yahoo.com',
      posts: [
        {
          __typename: 'BlogPost',
          _id: '5a6cf127c2b20834f6551484',
          title: 'Sunt ut aut',
        },
        {
          __typename: 'BlogPost',
          _id: '5a6cf127c2b20834f6551486',
          title: 'Nihil assumenda',
        },
      ],
    },
  ],
  findComment: {
    __typename: 'Comment',
    _id: '5a6cf127c2b20834f655148a',
    message: 'Voluptates ex sint amet repellendus impedit nam.',
  },
}

const typeWithSameTypeFieldsConnections = {
  findUser: {
    __typename: 'User',
    id: '5a6efb94b0e8c36f99fba013',
    email: 'Lloyd.Nikolaus@yahoo.com',
    referredBy: {
      __typename: 'User',
      id: '5a6cf127c2b20834f6551481',
      email: 'Madisen_Braun@hotmail.com',
    },
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
}

const allUsersConnections = {
  allUsers: [
    {
      __typename: 'User',
      id: '5a6cf127c2b20834f6551481',
      email: 'Madisen_Braun@hotmail.com',
      posts: {
        __typename: 'PostsConnection',
        pageInfo: {
          endCursor: 'Y3Vyc29yMw==',
          hasNextPage: false,
        },
        edges: [
          {
            node: {
              __typename: 'BlogPost',
              id: '5a6cf127c2b20834f6551483',
              title: 'Aut aut reiciendis',
            },
          },
          {
            node: {
              __typename: 'BlogPost',
              id: '5a6cf127c2b20834f6551485',
              title: 'Nesciunt esse',
            },
          },
        ],
      },
    },
    {
      __typename: 'User',
      id: '5a6cf127c2b20834f6551482',
      email: 'Robel.Ansel@yahoo.com',
      posts: {
        __typename: 'PostsConnection',
        pageInfo: {
          endCursor: 'Y3Vyc29yMw==',
          hasNextPage: true,
        },
        edges: [
          {
            node: {
              __typename: 'BlogPost',
              id: '5a6cf127c2b20834f6551484',
              title: 'Sunt ut aut',
            },
          },
          {
            node: {
              __typename: 'BlogPost',
              id: '5a6cf127c2b20834f6551486',
              title: 'Nihil assumenda',
            },
          },
        ],
      },
    },
  ],
}

const mergeTestData = {
  allComments: [
    {
      __typename: 'Comment',
      id: '5a6cf127c2b20834f655148e',
      author: {
        __typename: 'User',
        id: '5a6cf127c2b20834f6551481',
        email: 'Madisen_Braun@hotmail.com',
      },
    },
  ],
  findComment: {
    __typename: 'Comment',
    id: '5a6cf127c2b20834f655148e',
    message: 'Voluptates aut eum.',
  },
}

const noTypeNames = {
  allUsers: [
    {
      id: '5a6cf127c2b20834f6551481',
      email: 'Madisen_Braun@hotmail.com',
    },
    {
      id: '5a6cf127c2b20834f6551482',
      email: 'Robel.Ansel@yahoo.com',
    },
  ],
}

const noNested = {
  allUsers: [
    {
      __typename: 'User',
      id: '5a6cf127c2b20834f6551481',
      email: 'Madisen_Braun@hotmail.com',
    },
    {
      __typename: 'User',
      id: '5a6cf127c2b20834f6551482',
      email: 'Robel.Ansel@yahoo.com',
    },
  ],
  allBlogPosts: [
    {
      __typename: 'BlogPost',
      id: '5a6cf127c2b20834f6551483',
      likes: 0,
    },
    {
      __typename: 'BlogPost',
      id: '5a6cf127c2b20834f6551484',
      likes: 10,
    },
    {
      __typename: 'BlogPost',
      id: '5a6cf127c2b20834f6551485',
      likes: 23,
    },
    {
      __typename: 'BlogPost',
      id: '5a6cf127c2b20834f6551486',
      likes: 3,
    },
  ],
  allComments: [
    {
      __typename: 'Comment',
      id: '5a6cf127c2b20834f655148e',
      message: 'Voluptates aut eum.',
    },
    {
      __typename: 'Comment',
      id: '5a6cf127c2b20834f6551487',
      message: 'Et soluta ipsam quas facilis possimus et.',
    },
    {
      __typename: 'Comment',
      id: '5a6cf127c2b20834f6551488',
      message: 'Tempore sed enim qui aliquam est saepe qui.',
    },
    {
      __typename: 'Comment',
      id: '5a6cf127c2b20834f6551489',
      message: 'Ea et est autem dicta necessitatibus vel.',
    },
    {
      __typename: 'Comment',
      id: '5a6cf127c2b20834f655148b',
      message: 'Consectetur cum est odit et qui.',
    },
    {
      __typename: 'Comment',
      id: '5a6cf127c2b20834f655148d',
      message: 'Aut vel possimus nisi qui.',
    },
    {
      __typename: 'Comment',
      id: '5a6cf127c2b20834f655148a',
      message: 'Voluptates ex sint amet repellendus impedit nam.',
    },
    {
      __typename: 'Comment',
      id: '5a6cf127c2b20834f655148c',
      message: 'Voluptas quidem et saepe voluptatibus enim est.',
    },
  ],
}

const nested = {
  allUsers: [
    {
      __typename: 'User',
      id: '5a6cf127c2b20834f6551481',
      email: 'Madisen_Braun@hotmail.com',
      posts: [
        {
          __typename: 'BlogPost',
          id: '5a6cf127c2b20834f6551483',
          title: 'Aut aut reiciendis',
        },
        {
          __typename: 'BlogPost',
          id: '5a6cf127c2b20834f6551485',
          title: 'Nesciunt esse',
        },
      ],
    },
    {
      __typename: 'User',
      id: '5a6cf127c2b20834f6551482',
      email: 'Robel.Ansel@yahoo.com',
      posts: [
        {
          __typename: 'BlogPost',
          id: '5a6cf127c2b20834f6551484',
          title: 'Sunt ut aut',
        },
        {
          __typename: 'BlogPost',
          id: '5a6cf127c2b20834f6551486',
          title: 'Nihil assumenda',
        },
      ],
    },
  ],
  allBlogPosts: [
    {
      __typename: 'BlogPost',
      id: '5a6cf127c2b20834f6551483',
      likes: 0,
      comments: [
        {
          __typename: 'Comment',
          id: '5a6cf127c2b20834f655148e',
          message: 'Voluptates aut eum.',
        },
      ],
    },
    {
      __typename: 'BlogPost',
      id: '5a6cf127c2b20834f6551484',
      likes: 10,
      comments: [
        {
          __typename: 'Comment',
          id: '5a6cf127c2b20834f6551487',
          message: 'Et soluta ipsam quas facilis possimus et.',
        },
        {
          __typename: 'Comment',
          id: '5a6cf127c2b20834f6551488',
          message: 'Tempore sed enim qui aliquam est saepe qui.',
        },
        {
          __typename: 'Comment',
          id: '5a6cf127c2b20834f6551489',
          message: 'Ea et est autem dicta necessitatibus vel.',
        },
      ],
    },
    {
      __typename: 'BlogPost',
      id: '5a6cf127c2b20834f6551485',
      likes: 23,
      comments: [
        {
          __typename: 'Comment',
          id: '5a6cf127c2b20834f655148b',
          message: 'Consectetur cum est odit et qui.',
        },
        {
          __typename: 'Comment',
          id: '5a6cf127c2b20834f655148d',
          message: 'Aut vel possimus nisi qui.',
        },
      ],
    },
    {
      __typename: 'BlogPost',
      id: '5a6cf127c2b20834f6551486',
      likes: 3,
      comments: [
        {
          __typename: 'Comment',
          id: '5a6cf127c2b20834f655148a',
          message: 'Voluptates ex sint amet repellendus impedit nam.',
        },
        {
          __typename: 'Comment',
          id: '5a6cf127c2b20834f655148c',
          message: 'Voluptas quidem et saepe voluptatibus enim est.',
        },
      ],
    },
  ],
}

const listAndObject = {
  allUsers: [
    {
      __typename: 'User',
      id: '5a6cf127c2b20834f6551481',
      email: 'Madisen_Braun@hotmail.com',
      posts: [
        {
          __typename: 'BlogPost',
          id: '5a6cf127c2b20834f6551483',
          title: 'Aut aut reiciendis',
        },
        {
          __typename: 'BlogPost',
          id: '5a6cf127c2b20834f6551485',
          title: 'Nesciunt esse',
        },
      ],
    },
    {
      __typename: 'User',
      id: '5a6cf127c2b20834f6551482',
      email: 'Robel.Ansel@yahoo.com',
      posts: [
        {
          __typename: 'BlogPost',
          id: '5a6cf127c2b20834f6551484',
          title: 'Sunt ut aut',
        },
        {
          __typename: 'BlogPost',
          id: '5a6cf127c2b20834f6551486',
          title: 'Nihil assumenda',
        },
      ],
    },
  ],
  findComment: {
    __typename: 'Comment',
    id: '5a6cf127c2b20834f655148a',
    message: 'Voluptates ex sint amet repellendus impedit nam.',
  },
}

const listAndObjectConnections = {
  allUsers: [
    {
      __typename: 'User',
      id: '5a6cf127c2b20834f6551481',
      email: 'Madisen_Braun@hotmail.com',
      posts: {
        edges: [
          {
            node: {
              __typename: 'BlogPost',
              id: '5a6cf127c2b20834f6551483',
              title: 'Aut aut reiciendis',
            },
          },
          {
            node: {
              __typename: 'BlogPost',
              id: '5a6cf127c2b20834f6551485',
              title: 'Nesciunt esse',
            },
          },
        ],
      },
    },
    {
      __typename: 'User',
      id: '5a6cf127c2b20834f6551482',
      email: 'Robel.Ansel@yahoo.com',
      posts: {
        edges: [
          {
            node: {
              __typename: 'BlogPost',
              id: '5a6cf127c2b20834f6551484',
              title: 'Sunt ut aut',
            },
          },
          {
            node: {
              __typename: 'BlogPost',
              id: '5a6cf127c2b20834f6551486',
              title: 'Nihil assumenda',
            },
          },
        ],
      },
    },
  ],
  findComment: {
    __typename: 'Comment',
    id: '5a6cf127c2b20834f655148a',
    message: 'Voluptates ex sint amet repellendus impedit nam.',
  },
}

const listAndObjectConnectionsWithNullNodes = {
  allUsers: [
    null,
    {
      __typename: 'User',
      id: '5a6cf127c2b20834f6551481',
      email: 'Madisen_Braun@hotmail.com',
      posts: {
        edges: [
          {
            node: {
              __typename: 'BlogPost',
              id: '5a6cf127c2b20834f6551483',
              title: 'Aut aut reiciendis',
            },
          },
          {
            node: {
              __typename: 'BlogPost',
              id: '5a6cf127c2b20834f6551485',
              title: 'Nesciunt esse',
            },
          },
        ],
      },
    },
    {
      __typename: 'User',
      id: '5a6cf127c2b20834f6551482',
      email: 'Robel.Ansel@yahoo.com',
      posts: {
        edges: [
          {
            node: {
              __typename: 'BlogPost',
              id: '5a6cf127c2b20834f6551484',
              title: 'Sunt ut aut',
            },
          },
          null,
          {
            node: {
              __typename: 'BlogPost',
              id: '5a6cf127c2b20834f6551486',
              title: 'Nihil assumenda',
            },
          },
        ],
      },
    },
  ],
  findComment: {
    __typename: 'Comment',
    id: '5a6cf127c2b20834f655148a',
    message: 'Voluptates ex sint amet repellendus impedit nam.',
  },
}

const withScalarArrays = {
  allBlogPosts: [
    {
      __typename: 'BlogPost',
      id: '5a6cf127c2b20834f6551483',
      likes: 0,
      comments: [
        {
          __typename: 'Comment',
          id: '5a6cf127c2b20834f655148e',
          message: 'Voluptates aut eum.',
        },
      ],
      tags: [ 'tags', 'are', 'boring', ],
    },
    {
      __typename: 'BlogPost',
      id: '5a6cf127c2b20834f6551485',
      likes: 23,
      comments: [
        {
          __typename: 'Comment',
          id: '5a6cf127c2b20834f655148b',
          message: 'Consectetur cum est odit et qui.',
        },
        {
          __typename: 'Comment',
          id: '5a6cf127c2b20834f655148d',
          message: 'Aut vel possimus nisi qui.',
        },
      ],
    },
  ],
}

const withScalarArraysConnections = {
  allBlogPosts: [
    {
      __typename: 'BlogPost',
      id: '5a6cf127c2b20834f6551483',
      likes: 0,
      comments: {
        edges: [
          {
            node: {
              __typename: 'Comment',
              id: '5a6cf127c2b20834f655148e',
              message: 'Voluptates aut eum.',
            },
          },
        ],
      },
      tags: [ 'tags', 'are', 'boring', ],
    },
    {
      __typename: 'BlogPost',
      id: '5a6cf127c2b20834f6551485',
      likes: 23,
      comments: {
        edges: [
          {
            node: {
              __typename: 'Comment',
              id: '5a6cf127c2b20834f655148b',
              message: 'Consectetur cum est odit et qui.',
            },
          },
          {
            node: {
              __typename: 'Comment',
              id: '5a6cf127c2b20834f655148d',
              message: 'Aut vel possimus nisi qui.',
            },
          },
        ],
      },
    },
  ],
}

const withMultipleTypesConnections = {
  collections: [
    {
      __typename: 'Collection',
      _id: '5a6cf127c2b20834f655148d',
      name: 'Continue Watching',
      videos: {
        edges: [
          {
            node: {
              __typename: 'Movie',
              _id: '5a6cf127c2b20834f655148a',
              name: 'Batman',
            },
          },
          {
            node: {
              __typename: 'Show',
              _id: '5a6cf127c2b20834f655148b',
              name: 'Prison Break',
            },
          },
          {
            node: {
              __typename: 'Movie',
              _id: '5a6cf127c2b20834f655148c',
              name: 'Superman',
            },
          },
        ],
      },
    },
  ],
}

const withIgnoreList = {
  allUsers: [
    {
      __typename: 'User',
      id: '5a6cf127c2b20834f6551481',
      email: 'Madisen_Braun@hotmail.com',
      address: {
        street: 'Street',
        zip: '10000',
        city: 'LA',
        __typename: 'Address',
      },
    },
    {
      __typename: 'User',
      id: '5a6cf127c2b20834f6551482',
      email: 'Robel.Ansel@yahoo.com',
      address: {
        street: 'Street #2',
        zip: '20000',
        city: 'New York',
        __typename: 'Address',
      },
    },
  ],
}

const useConnectionsGraphqlQuery = `
  query getCollections {
    users {
      friends {
        edges {
          node {
            name
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }
`

module.exports = {
  typeWithSameTypeFieldsConnections,
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
  useConnectionsGraphqlQuery,
  withIgnoreList,
}
