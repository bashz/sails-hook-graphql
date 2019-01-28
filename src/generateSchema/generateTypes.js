const format = require('../utils/namingFormats')
const validator = require('validator')

const createEnum = function (arrayEnum) {
  let objectEnum = {}
  for (let i = 0; i < arrayEnum.length; i++) {
    objectEnum[format.capAll(arrayEnum[i])] = {value: arrayEnum[i]}
  }
  return objectEnum
}

const getType = function (attribute, attrName, graphql) {
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
    const type = new graphql.GraphQLEnumType({
      name: attrName,
      values: createEnum(attribute.validations.isIn)
    })
    return type
  }
  if ( attribute.required ) {
    
  }

}

module.exports = {
  internals (graphql) {
    graphql.internalDate = new graphql.GraphQLScalarType({
      name: 'Date',
      serialize (value) {
        return new Date(value)
      },
      parseValue (value) {
        return new Date(value).toDateString()
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          return new Date(ast.value)
        }
        return null
      }
    })

    graphql.internalEmail = new graphql.GraphQLScalarType({
      name: 'Email',
      serialize (value) {
        return value
      },
      parseValue (value) {
        return value
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.STRING && validator.isEmail(ast.value)) {
          return ast.value
        }
        return null
      }
    })

    graphql.internalColor = new graphql.GraphQLScalarType({
      name: 'Color',
      serialize (value) {
        return value
      },
      parseValue (value) {
        return value
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.STRING && validator.isHexColor(ast.value)) {
          return ast.value
        }
        return null
      }
    })

    graphql.internalIP = new graphql.GraphQLScalarType({
      name: 'IP',
      serialize (value) {
        return value
      },
      parseValue (value) {
        return value
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.STRING && validator.isIP(ast.value)) {
          return ast.value
        }
        return null
      }
    })

    graphql.internalURL = new graphql.GraphQLScalarType({
      name: 'URL',
      serialize (value) {
        return value
      },
      parseValue (value) {
        return value
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.STRING && validator.isURL(ast.value)) {
          return ast.value
        }
        return null
      }
    })

    graphql.internalUUID = new graphql.GraphQLScalarType({
      name: 'UUID',
      serialize (value) {
        return value
      },
      parseValue (value) {
        return value
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.STRING && validator.isUUID(ast.value)) {
          return ast.value
        }
        return null
      }
    })
    
    return graphql
  },
  unbound (model, graphql) {
    for (let attrName in model.attributes) {
      let type = graphql.GraphQLString
      let attribute = model.attributes[attrName] 
      type = getType(attribute, attrName, graphql)
    }
  },
  associations (model, inputs, graphql) {
    
  }
}
