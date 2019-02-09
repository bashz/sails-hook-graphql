module.exports = getSearchType = function (attribute, graphql) {
  if (attribute.collection) {
    return graphql.internalIDList
  }
  if (
    attribute.autoMigrations &&
    (
      attribute.autoMigrations.columnType === '_numberkey' ||
      attribute.autoMigrations.columnType === '_stringkey'
    )
  ) {
    return graphql.GraphQLID
  }
  if (attribute.type === 'number') {
    return graphql.internalPrecision
  }
  if (attribute.type === 'string') {
    return graphql.internalLiteral
  }
  if (attribute.type === 'boolean') {
    return graphql.GraphQLBoolean
  }
  if (attribute.type === 'json') {
    return graphql.internalJSON
  }
  if (attribute.type === 'ref') {
    return graphql.internalRef
  }
}

