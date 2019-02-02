const validator = require('validator')

module.exports = internals = function (graphql) {
  graphql.enums = {}
  
  graphql.internalRef = new graphql.GraphQLScalarType({
    name: 'Ref',
    serialize (value) {
      let binString = ''
      try {
        binString = Buffer.from(value).toString('base64').toString('utf8')
      } catch (e) {
        console.error(e)
      }
      return binString
    },
    parseValue (value) {
      let base64String = ''
      try {
        base64String = Buffer.from(value).toString('base64')
      } catch (e) {
        console.error(e)
      }
      return base64String
    },
    parseLiteral(ast) {
      let binString = null
      if (ast.kind === Kind.STRING) {
        try {
          binString = Buffer.from(value).toString('base64').toString('utf8')
        } catch (e) {
          console.error(e)
        }
      }
      return binString
    }
  })

  graphql.internalJSON = new graphql.GraphQLScalarType({
    name: 'Json',
    serialize (value) {
      let jsonString = ''
      try {
        jsonString = JSON.stringify(value)
      } catch (e) {
        console.error(e)
      }
      return jsonString
    },
    parseValue (value) {
      return value
    },
    parseLiteral(ast) {
      let jsonString = null
      if (ast.kind === Kind.OBJECT) {
        try {
          jsonString = JSON.stringify(value)
        } catch (e) {
          console.error(e)
        }
      }
      return jsonString
    }
  })

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
}
