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
  if (attribute.required || attribute.defaultsTo) {
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

module.exports = {
  internals (graphql) {
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
  },
  attributes (model, graphql) {
    let fields = {}
    for (let attrName in model.attributes) {
      let attribute = model.attributes[attrName]
      if (!attribute.collection && !attribute.model) {
        fields[attrName] = {
          type: getType(attribute, attrName, graphql),
          resolve (root) {
            root[attrName]
          }
        }
      }
    }
    return {
      name: format.type(format.capInitial(model.identity)),
      fields
    }
  },
  through (model, models, graphql) {
    // must not loop and retuen 1 result, better names are needed
    let throughs = {}
    for (let i = 0; i < model.associations.length; i++) {
      let association = model.associations[i]
      if (association.type === 'collection') {
        if (association.via && model.attributes[association.alias].through) {
          throughs[model.attributes[association.alias].through + association.alias] = new graphql.GraphQLObjectType({
            name: format.type(format.capInitial(model.attributes[association.alias].through) + format.capInitial(association.alias)),
            fields: _.merge(_.merge({}, models[association.collection].unbound.fields), models[model.attributes[association.alias].through].unbound.fields)
          })
        }
      }
    }
    return throughs
  },
  associations (model, models, throughs, graphql) {
    for (let i = 0; i < model.associations.length; i++) {
      let association = model.associations[i]
      if (association.type === 'model') {
        if (model.attributes[association.alias].required) {
          model.unbound.fields[association.alias] = {
            type: new graphql.GraphQLNonNull(models[association.model].qlObject),
            resolve (root) {
              root[association.alias]
            }
          }
        } else {
          model.unbound.fields[association.alias] = {
            type: models[association.model].qlObject,
            resolve (root) {
              root[association.alias]
            }
          }
        }
      }
      if (association.type === 'collection') {
        if (association.via && !model.attributes[association.alias].through && models[association.collection].attributes[association.via].required) {
          model.unbound.fields[association.alias] = {
            type: new graphql.GraphQLNonNull(new graphql.GraphQLList(new graphql.GraphQLNonNull(models[association.collection].qlObject))),
            resolve (root) {
              root[association.alias]
            }
          }
        }
        if (association.via && model.attributes[association.alias].through) {
          model.unbound.fields[association.alias] = {
            type: new graphql.GraphQLList(throughs[model.attributes[association.alias].through + association.alias]),
            resolve (root) {
              root[association.alias]
            }
          }
        } else {
          model.unbound.fields[association.alias] = {
            type: new graphql.GraphQLNonNull(new graphql.GraphQLList(models[association.collection].qlObject)),
            resolve (root) {
              root[association.alias]
            }
          }
        }
      }
    }
    return model.qlObject
  }
}
