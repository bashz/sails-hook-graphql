const format = require('../utils/namingFormats')
const generateInternals = require('./generateTypes/generateInternals')
const generateTypes = require('./generateTypes')
const generateQueries = require('./generateQueries')
const generateMutators = require('./generateMutators')

module.exports = (models, graphql) => {
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

  let queries = {}
  for (var model in models) {
    let query = generateQueries(models[model], graphql)
    queries[model] = query.single
    queries[format.plurialize(model)] = query.plurial
  }

  let mutations = {}
  for (var model in models) {
    let mutation = generateMutators(models[model], graphql)
    mutations[format.create(model)] = mutation.create
    mutations[format.update(model)] = mutation.update
    mutations[format.remove(model)] = mutation.remove
  }

  // We need to expose a hook here -before creating- for devs to override or add to the schema !

  const Schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
      name: 'RootQueryType',
      fields: queries
    }),
    mutation: new graphql.GraphQLObjectType({
      name: 'RootMutationType',
      fields: mutations
    }) 
  })
  // console.log(graphql.printSchema(Schema))
  return Schema
}
