const babel = require('rollup-plugin-babel')
const pkg = require('./package.json')

const input = './src/index.js'
const globals = { graphql: 'GraphQL', }
const babelOpts = {
  exclude: '**/node_modules/**',
  runtimeHelpers: true,
}

module.exports = {
  input,
  output: {
    file: pkg.main,
    format: 'cjs',
    globals,
  },
  treeshake: true,
  external: Object.keys(globals),
  plugins: [ babel(babelOpts), ],
}
