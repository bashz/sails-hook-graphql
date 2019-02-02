const createEnum = require('./createEnum')

module.exports = getType = function (attribute, attrName, graphql, forceNull = false) {
  if (
    attribute.autoMigrations &&
    (
      attribute.autoMigrations.columnType === '_numberkey' ||
      attribute.autoMigrations.columnType === '_stringkey'
    )
  ) {
    return graphql.GraphQLID
  }
  if (attribute.validations && attribute.validations.isIn) {
    if (!graphql.enums[attrName]) {
      graphql.enums[attrName] = new graphql.GraphQLEnumType({
        name: attrName,
        values: createEnum(attribute.validations.isIn)
      })
    }
    return graphql.enums[attrName]
  }
  if (attribute.required || attribute.defaultsTo && !forceNull) {
    if (attribute.type === 'number') {
      if (attribute.autoMigrations && attribute.autoMigrations.columnType === '_numbertimestamp') {
        return new graphql.GraphQLNonNull(graphql.internalDate)
      }
      if (attribute.validations && attribute.validations.isInteger) {
        return new graphql.GraphQLNonNull(graphql.GraphQLInt)
      }
      return new graphql.GraphQLNonNull(graphql.GraphQLFloat)
    }
    if (attribute.type === 'string') {
      if (attribute.validations) {
        if (attribute.validations.isEmail) {
          return new graphql.GraphQLNonNull(graphql.internalEmail)
        }
        if (attribute.validations.isHexColor) {
          return new graphql.GraphQLNonNull(graphql.internalColor)
        }
        if (attribute.validations.isIP) {
          return new graphql.GraphQLNonNull(graphql.internalIP)
        }
        if (attribute.validations.isURL) {
          return new graphql.GraphQLNonNull(graphql.internalURL)
        }
        if (attribute.validations.isUUID) {
          return new graphql.GraphQLNonNull(graphql.internalUUID)
        }
      }
      return new graphql.GraphQLNonNull(graphql.GraphQLString)
    }
    if (attribute.type === 'boolean') {
      return new graphql.GraphQLNonNull(graphql.GraphQLBoolean)
    }
    if (attribute.type === 'json') {
      return new graphql.GraphQLNonNull(graphql.internalJSON)
    }
    if (attribute.type === 'ref') {
      return new graphql.GraphQLNonNull(graphql.internalRef)
    }
  }
  if (attribute.type === 'number') {
    if (attribute.autoMigrations && attribute.autoMigrations.columnType === '_numbertimestamp') {
      return graphql.internalDate
    }
    if (attribute.validations && attribute.validations.isInteger) {
      return graphql.GraphQLInt
    }
    return graphql.GraphQLFloat
  }
  if (attribute.type === 'string') {
    if (attribute.validations) {
      if (attribute.validations.isEmail) {
        return graphql.internalEmail
      }
      if (attribute.validations.isHexColor) {
        return graphql.internalColor
      }
      if (attribute.validations.isIP) {
        return graphql.internalIP
      }
      if (attribute.validations.isURL) {
        return graphql.internalURL
      }
      if (attribute.validations.isUUID) {
        return graphql.internalUUID
      }
    }
    return graphql.GraphQLString
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
