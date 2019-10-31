const format = require('../utils/namingFormats')
const generateInternals = require('./generateTypes/generateInternals')
const generateTypes = require('./generateTypes')
const generateQueries = require('./generateQueries')
const generateMutators = require('./generateMutators')

module.exports = (models, graphql, configKey) => {
  graphql = generateInternals(graphql)

  // outputs
  for (let model in models) {
    models[model].unbound = generateTypes.attributes(models[model], graphql)
    models[model].qlObject = new graphql.GraphQLObjectType(models[model].unbound)
  }

  let throughs = {}
  for (let model in models) {
    Object.assign(throughs, generateTypes.through(models[model], models, graphql))
  }
  
  for (let model in models) {
    models[model].qlObject = generateTypes.associations(models[model], models, throughs, graphql)
  }

  // query args
  for (let model in models) {
    models[model].qlQueryIntputs = generateTypes.queryInputs(models[model], models, throughs, graphql)
  }

  // inputs
  for (let model in models) {
    models[model].unboundInput = generateTypes.inputAttributes(models[model], graphql)
    models[model].qlInputObject = new graphql.GraphQLInputObjectType(models[model].unboundInput)
  }

  // Disabling Assiociation mutation for this release
  // let inputThroughs = {}
  // for (let model in models) {
  //   Object.assign(inputThroughs, generateTypes.inputThrough(models[model], models, graphql))
  // }
  
  // for (let model in models) {
  //   models[model].qlInputObject = generateTypes.inputAssociations(models[model], models, inputThroughs, graphql)
  // }

  let generatedQueries = {}
  for (var model in models) {
    let query = generateQueries(models[model], graphql)
    generatedQueries[model] = query.single
    generatedQueries[format.plurialize(model)] = query.plurial
  }

  let generatedMutations = {}
  for (var model in models) {
    let mutation = generateMutators(models[model], graphql)
    generatedMutations[format.create(model)] = mutation.create
    generatedMutations[format.update(model)] = mutation.update
    generatedMutations[format.remove(model)] = mutation.remove
  }

  // We need to expose a hook here -before creating- for devs to override or add to the schema !
  const { queries, mutations } = sails.config[configKey].schemaHook(generatedQueries, generatedMutations)

  const schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
      name: 'RootQueryType',
      fields: queries
    }),
    mutation: new graphql.GraphQLObjectType({
      name: 'RootMutationType',
      fields: mutations
    }) 
  })
  return schema
}
