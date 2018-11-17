const test = require('ava')
const { pluralize, } = require('../lib/pluralize')

const irregularPlurals = {
  addendum: [ 'addenda', ],
  alga: [ 'algae', ],
  alumna: [ 'alumnae', ],
  alumnus: [ 'alumni', ],
  analysis: [ 'analyses', ],
  antenna: [ 'antennas', 'antennae', ],
  apparatus: [ 'apparatuses', ],
  appendix: [ 'appendices', 'appendixes', ],
  axis: [ 'axes', ],
  bacillus: [ 'bacilli', ],
  bacterium: [ 'bacteria', ],
  basis: [ 'bases', ],
  beau: [ 'beaux', 'beaus', ],
  bison: [ 'bison', ],
  buffalo: [ 'buffalos', 'buffaloes', ],
  bureau: [ 'bureaus', ],
  bus: [ 'busses', 'buses', ],
  cactus: [ 'cactuses', 'cacti', ],
  calf: [ 'calves', ],
  child: [ 'children', ],
  corps: [ 'corps', ],
  corpus: [ 'corpora', 'corpuses', ],
  crisis: [ 'crises', ],
  criterion: [ 'criteria', ],
  curriculum: [ 'curricula', ],
  datum: [ 'data', ],
  deer: [ 'deer', ],
  die: [ 'dice', ],
  dwarf: [ 'dwarfs', 'dwarves', ],
  diagnosis: [ 'diagnoses', ],
  echo: [ 'echoes', ],
  elf: [ 'elves', ],
  ellipsis: [ 'ellipses', ],
  embargo: [ 'embargoes', 'embargos', ],
  emphasis: [ 'emphases', ],
  erratum: [ 'errata', ],
  fireman: [ 'firemen', ],
  fish: [ 'fish', 'fishes', ],
  focus: [ 'focuses', 'foci', ],
  foot: [ 'feet', ],
  formula: [ 'formulas', ],
  fungus: [ 'fungi', 'funguses', ],
  genus: [ 'genera', ],
  goose: [ 'geese', ],
  half: [ 'halves', ],
  hero: [ 'heroes', ],
  hippopotamus: [ 'hippopotami', 'hippopotamuses', ],
  hoof: [ 'hoofs', 'hooves', ],
  hypothesis: [ 'hypotheses', ],
  index: [ 'indices', 'indexes', ],
  knife: [ 'knives', ],
  leaf: [ 'leaves', ],
  life: [ 'lives', ],
  loaf: [ 'loaves', ],
  louse: [ 'lice', ],
  man: [ 'men', ],
  matrix: [ 'matrices', ],
  means: [ 'means', ],
  medium: [ 'media', 'mediums', ],
  memorandum: [ 'memorandums', 'memoranda', ],
  millennium: [ 'millenniums', 'millennia', ],
  moose: [ 'moose', ],
  mosquito: [ 'mosquitoes', 'mosquitos', ],
  mouse: [ 'mice', ],
  nebula: [ 'nebulae', 'nebulas', ],
  neurosis: [ 'neuroses', ],
  nucleus: [ 'nuclei', ],
  oasis: [ 'oases', ],
  octopus: [ 'octopi', 'octopuses', ],
  ovum: [ 'ova', ],
  ox: [ 'oxen', ],
  paralysis: [ 'paralyses', ],
  parenthesis: [ 'parentheses', ],
  person: [ 'people', ],
  phenomenon: [ 'phenomena', ],
  potato: [ 'potatoes', ],
  radius: [ 'radii', 'radiuses', ],
  scarf: [ 'scarfs', 'scarves', ],
  self: [ 'selves', ],
  series: [ 'series', ],
  sheep: [ 'sheep', ],
  shelf: [ 'shelves', ],
  scissors: [ 'scissors', ],
  species: [ 'species', ],
  stimulus: [ 'stimuli', ],
  stratum: [ 'strata', ],
  syllabus: [ 'syllabi', 'syllabuses', ],
  symposium: [ 'symposia', 'symposiums', ],
  synthesis: [ 'syntheses', ],
  synopsis: [ 'synopses', ],
  tableau: [ 'tableaux', 'tableaus', ],
  that: [ 'those', ],
  thesis: [ 'theses', ],
  thief: [ 'thieves', ],
  'this': [ 'these', ],
  tomato: [ 'tomatoes', ],
  tooth: [ 'teeth', ],
  torpedo: [ 'torpedoes', ],
  vertebra: [ 'vertebrae', ],
  veto: [ 'vetoes', 'vetos', ],
  vita: [ 'vitae', ],
  watch: [ 'watches', ],
  wife: [ 'wives', ],
  wolf: [ 'wolves', ],
  woman: [ 'women', ],
  zero: [ 'zeros', 'zeroes', ],
}

const generalTest = {
  user: 'users',
  address: 'addresses',
  addresses: 'addresses',
  accounts: 'accounts',
  id: 'ids',
  IDS: 'IDS',
  APPLE: 'APPLES',
}

test('pluralize :: returns correct form', t => {
  const entries = Object.entries(generalTest)
  t.plan(entries.length)

  for (const [ key, value, ] of entries) {
    const plural = pluralize(key)
    t.true(plural === value)
  }
})

test('pluralize :: returns correct form for irregular plural', t => {
  const entries = Object.entries(irregularPlurals)
  t.plan(entries.length)

  for (const [ key, values, ] of entries) {
    const plural = pluralize(key)
    t.true(values.includes(plural))
  }
})
