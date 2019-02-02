const validator = require('validator')

module.exports = internals = function (graphql) {
  graphql.enums = {}
  
  graphql.internalRef = new graphql.GraphQLScalarType({
    name: 'Ref',
    serialize (value) {
      let base64String = ''
      try {
        base64String = Buffer.from(value).toString('base64').toString('utf8')
      } catch (e) {
        console.error(e)
      }
      return base64String
    },
    parseValue (value) {
      let bin = null
      try {
        bin = Buffer.from(value, 'base64')
      } catch (e) {
        console.error(e)
      }
      return bin
    },
    parseLiteral(ast) {
      // TODO
      return ast.value
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
      let jsonObject = null
      try {
        jsonObject = JSON.parse(value)
      } catch (e) {
        console.error(e)
      }
      return jsonObject
    },
    parseLiteral(ast) {
      // TODO
      return ast.value
    }
  })

  graphql.internalDate = new graphql.GraphQLScalarType({
    name: 'Date',
    serialize (value) {
      return {utc: new Date(value).toUTCString(), timestamp: value}
    },
    parseValue (value) {
      if (!(value instanceof Date)) {
        value = new Date(value).valueOf()
      }
      return value.valueOf()
    },
    parseLiteral(ast) {
      // TODO
      return ast.value
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
