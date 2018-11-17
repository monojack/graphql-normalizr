const test = require('ava')
const { camelize, decamelize, pascalize, } = require('../')

const camelizeTests = {
  foobar: 'foobar',
  fooBarBaz: 'fooBarBaz',
  foo_bar: 'fooBar',
  'foo-bar': 'fooBar',
  'foo-bar_baz': 'fooBarBaz',
  FooBar_baz: 'fooBarBaz',
  'foo-BarBaz_quux': 'fooBarBazQuux',
  'foo-BarBaz_QUUX': 'fooBarBazQUUX',
  'foo__bar-_baz_-quux': 'fooBarBazQuux',
}

const decamelizeTests = {
  foobar: 'foobar',
  foo_bar: 'foo_bar',
  foo_bar_baz: 'foo_bar_baz',
  fooBar: 'foo_bar',
  fooBarBaz: 'foo_bar_baz',
  fooBarBazQUUX: 'foo_bar_baz_q_u_u_x',
}

const pascalizeTests = {
  Foobar: 'Foobar',
  FooBar: 'FooBar',
  foo_bar_baz: 'FooBarBaz',
  'foo-bar-baz-quux': 'FooBarBazQuux',
  'foo-bar-baz_quux_quuz': 'FooBarBazQuuxQuuz',
  'corgeGrault-garply': 'CorgeGraultGarply',
  'corgeGrault-garplyWaldo': 'CorgeGraultGarplyWaldo',
  'corgeGrault-garplyWaldo_Fred': 'CorgeGraultGarplyWaldoFred',
  'corgeGrault-garplyWaldo_Fred-PLUGH': 'CorgeGraultGarplyWaldoFredPLUGH',
}

test('camelize :: returns correct form for the required case', t => {
  const entries = Object.entries(camelizeTests)
  t.plan(entries.length)

  for (const [ key, value, ] of entries) {
    const camelized = camelize(key)
    t.true(camelized === value)
  }
})

test('camelize :: returns correct form for the required case', t => {
  const entries = Object.entries(camelizeTests)
  t.plan(entries.length)

  for (const [ key, value, ] of entries) {
    const camelized = camelize(key)
    t.true(camelized === value)
  }
})

test('decamelize :: returns correct form for the required case', t => {
  const entries = Object.entries(decamelizeTests)
  t.plan(entries.length)

  for (const [ key, value, ] of entries) {
    const decamelized = decamelize(key)
    t.true(decamelized === value)
  }
})

test('pascalize :: returns correct form for the required case', t => {
  const entries = Object.entries(pascalizeTests)
  t.plan(entries.length)

  for (const [ key, value, ] of entries) {
    const pascalized = pascalize(key)
    t.true(pascalized === value)
  }
})
