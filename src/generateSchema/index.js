const format = require('../utils/namingFormats')
const generateTypes = require('./generateTypes')
const generateQueries = require('./generateQueries')
const generateMutators = require('./generateMutators')

module.exports = (models, graphql) => {
  graphql = generateTypes.internals(graphql)
  for (let model in models) {
    models[model].unbound = generateTypes.attributes(models[model], graphql)
    models[model].qlObject = new graphql.GraphQLObjectType(models[model].unbound)
  }
  let throughs = {}
  for (let model in models) {
    Object.assign(throughs, generateTypes.through(models[model], models, graphql))
  }
  console.log(throughs)
  for (let model in models) {
    models[model].qlObject = generateTypes.associations(models[model], models, throughs, graphql)
  }

  // Temporary Schema to validate types are working! only!
  let queries = {}
  for (let model in models) {
    queries[model] = {type: models[model].qlObject}
  }

  const Schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
      name: 'Query',
      fields: queries
    })
  })
  console.log(graphql.printSchema(Schema))
  return Schema
}
