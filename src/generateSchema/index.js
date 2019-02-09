const format = require('../utils/namingFormats')
const generateInternals = require('./generateTypes/generateInternals')
const generateTypes = require('./generateTypes')
const generateQueries = require('./generateQueries')
const generateMutators = require('./generateMutators')

module.exports = (models, graphql) => {
  graphql = generateInternals(graphql)

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

  for (let model in models) {
    models[model].qlQueryIntputs = generateTypes.queryInputs(models[model], models, throughs, graphql)
  }

  let queries = {}
  for (var model in models) {
    let query = generateQueries(models[model], graphql)
    queries[model] = query.single
    queries[format.plurialize(model)] = query.plurial
  }
  // Temporary Schema to validate types are working! only!
  // let queries = {}
  // for (let model in models) {
  //   queries[model] = {type: models[model].qlObject}
  // }
  console.log(models.user.attributes)
  const Schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
      name: 'Query',
      fields: queries
    })
  })
  console.log(graphql.printSchema(Schema))
  return Schema
}
