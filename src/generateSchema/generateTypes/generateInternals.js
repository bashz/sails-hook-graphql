const validator = require('validator')

module.exports = internals = function (graphql) {
  graphql.enums = {
    sortType: new graphql.GraphQLEnumType({
      name: 'sortType',
      values: createEnum(['ASC', 'DESC'])
    })
  }

  // Not actually in use to be reintroduced with aggregation resolvers
  graphql.internalIDList = new graphql.GraphQLList(graphql.GraphQLID)

  graphql.internalPrecision = new graphql.GraphQLScalarType({
    name: 'Precision',
    serialize (value) {
      let precision = NaN
      try {
        precision = JSON.stringify(value)
      } catch (e) {
        console.error(e)
      }
      return precision
    },
    parseValue (value) {
      let precision = value
      try {
        precision = JSON.parse(value)
      } catch (e) {
        console.error(e)
      }
      return precision
    },
    parseLiteral(ast) {
      let precision = null
      if (ast.kind === graphql.Kind.INT || ast.kind === graphql.Kind.FLOAT) {
        precision = ast.value
      }
      if (ast.kind === graphql.Kind.OBJECT) {
        precision = {}
        for (let i = 0; i < ast.fields.length; i++) {
          if (ast.fields[i].name.value === 'not') {
            if (ast.fields[i].value.kind === graphql.Kind.INT || ast.fields[i].value.kind === graphql.Kind.FLOAT) {
              precision['!='] = ast.fields[i].value.value
            }
          }
          if (ast.fields[i].name.value === 'from') {
            if (ast.fields[i].value.kind === graphql.Kind.INT || ast.fields[i].value.kind === graphql.Kind.FLOAT) {
              precision['>='] = ast.fields[i].value.value
            }
          }
          if (ast.fields[i].name.value === 'to') {
            if (ast.fields[i].value.kind === graphql.Kind.INT || ast.fields[i].value.kind === graphql.Kind.FLOAT) {
              precision['<='] = ast.fields[i].value.value
            }
          }
          if (ast.fields[i].name.value === 'notBefore') {
            if (ast.fields[i].value.kind === graphql.Kind.INT || ast.fields[i].value.kind === graphql.Kind.FLOAT) {
              precision['>'] = ast.fields[i].value.value
            }
          }
          if (ast.fields[i].name.value === 'notAfter') {
            if (ast.fields[i].value.kind === graphql.Kind.INT || ast.fields[i].value.kind === graphql.Kind.FLOAT) {
              precision['<'] = ast.fields[i].value.value
            }
          }
          if (ast.fields[i].name.value === 'in') {
            if (ast.fields[i].value.kind === graphql.Kind.LIST ) {
              precision['in'] = ast.fields[i].value.values
                .filter(v => v.kind === graphql.Kind.INT || v.kind === graphql.Kind.FLOAT)
                .map(v => v.value)
            }
          }
          if (ast.fields[i].name.value === 'notIn') {
            if (ast.fields[i].value.kind === graphql.Kind.LIST ) {
              precision['nin'] = ast.fields[i].value.values
                .filter(v => v.kind === graphql.Kind.INT || v.kind === graphql.Kind.FLOAT)
                .map(v => v.value)
            }
          }
        }
      }
      return precision
    }
  })

  graphql.internalLiteral = new graphql.GraphQLScalarType({
    name: 'Literal',
    serialize (value) {
      let literal = ''
      try {
        literal = JSON.stringify(value)
      } catch (e) {
        console.error(e)
      }
      return literal
    },
    parseValue (value) {
      let literal = ''
      try {
        literal = JSON.parse(value)
      } catch (e) {
        console.error(e)
      }
      return literal
    },
    parseLiteral(ast) {
      let literal = null
      if (ast.kind === graphql.Kind.STRING || ast.kind === graphql.Kind.ENUM) {
        literal = ast.value
      }
      if (ast.kind === graphql.Kind.OBJECT) {
        literal = {}
        for (let i = 0; i < ast.fields.length; i++) {
          if (ast.fields[i].name.value === 'not') {
            if (ast.fields[i].value.kind === graphql.Kind.STRING || ast.fields[i].value.kind === graphql.Kind.ENUM) {
              literal['!='] = ast.fields[i].value.value
            }
          }
          if (ast.fields[i].name.value === 'contains') {
            if (ast.fields[i].value.kind === graphql.Kind.STRING || ast.fields[i].value.kind === graphql.Kind.ENUM) {
              literal['contains'] = ast.fields[i].value.value
            }
          }
          if (ast.fields[i].name.value === 'startsWith') {
            if (ast.fields[i].value.kind === graphql.Kind.STRING || ast.fields[i].value.kind === graphql.Kind.ENUM) {
              literal['startsWith'] = ast.fields[i].value.value
            }
          }
          if (ast.fields[i].name.value === 'endsWith') {
            if (ast.fields[i].value.kind === graphql.Kind.STRING || ast.fields[i].value.kind === graphql.Kind.ENUM) {
              literal['endsWith'] = ast.fields[i].value.value
            }
          }
          if (ast.fields[i].name.value === 'in') {
            if (ast.fields[i].value.kind === graphql.Kind.LIST ) {
              literal['in'] = ast.fields[i].value.values
                .filter(v => v.kind === graphql.Kind.STRING || v.kind === graphql.Kind.ENUM)
                .map(v => v.value)
            }
          }
          if (ast.fields[i].name.value === 'notIn') {
            if (ast.fields[i].value.kind === graphql.Kind.LIST ) {
              literal['nin'] = ast.fields[i].value.values
                .filter(v => v.kind === graphql.Kind.STRING || v.kind === graphql.Kind.ENUM)
                .map(v => v.value)
            }
          }
        }
      }
      return literal
    }
  })
  
  graphql.internalPagination = {
    first: {type: graphql.GraphQLInt},
    last: {type: graphql.GraphQLInt},
    page: {type: graphql.GraphQLInt, defaultValue: 1},
    items: {type: graphql.GraphQLInt, defaultValue: 30},
    // Sorting can be multiple :/ not yet supported
    sortBy: {type: graphql.GraphQLString, defaultValue: 'createdAt'},
    sortType: {type: graphql.enums.sortType, defaultValue: 'ASC'}
  }

  graphql.internalRef = new graphql.GraphQLScalarType({
    name: 'Ref',
    serialize (value) {
      let base64String = ''
      try {
        base64String = Buffer.from(value).toString('base64')
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
      if (ast.kind === graphql.Kind.STRING && validator.isEmail(ast.value)) {
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
      if (ast.kind === graphql.Kind.STRING && validator.isHexColor(ast.value)) {
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
      if (ast.kind === graphql.Kind.STRING && validator.isIP(ast.value)) {
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
      if (ast.kind === graphql.Kind.STRING && validator.isURL(ast.value)) {
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
      if (ast.kind === graphql.Kind.STRING && validator.isUUID(ast.value)) {
        return ast.value
      }
      return null
    }
  })
  return graphql
}
