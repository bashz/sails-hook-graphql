const format = require('../utils/namingFormats')
const generateTypes = require('./generateTypes')
const generateQueries = require('./generateQueries')
const generateMutators = require('./generateMutators')

module.exports = (models, graphql) => {
  let unbound = {}
  graphql = generateTypes.internals(graphql)
  // console.log(graphql)
  for (let model in models) {
    unbound[model] = generateTypes.attributes(models[model], graphql)
  }
  console.log(models.profile.attributes)
  // console.log(models.profile._adapter.datastores.default.primaryKeyCols)
  // console.log(models.user.associations)
  // console.log(sails)
}
