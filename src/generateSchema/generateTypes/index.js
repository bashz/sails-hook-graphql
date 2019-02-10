const format = require('../../utils/namingFormats')
const getType = require('./getType')
const getSearchType = require('./getSearchType')

module.exports = {
  attributes (model, graphql) {
    let fields = {}
    for (let attrName in model.attributes) {
      let attribute = model.attributes[attrName]
      if (!attribute.collection && !attribute.model) {
        fields[attrName] = {
          type: getType(attribute, attrName, graphql),
          resolve (root) {
            return root[attrName]
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
              return root[association.alias]
            }
          }
        } else {
          model.unbound.fields[association.alias] = {
            type: models[association.model].qlObject,
            resolve (root) {
              return root[association.alias]
            }
          }
        }
      }
      if (association.type === 'collection') {
        if (association.via && !model.attributes[association.alias].through && models[association.collection].attributes[association.via].required) {
          model.unbound.fields[association.alias] = {
            type: new graphql.GraphQLNonNull(new graphql.GraphQLList(new graphql.GraphQLNonNull(models[association.collection].qlObject))),
            resolve (root) {
              return root[association.alias]
            }
          }
        }
        if (association.via && model.attributes[association.alias].through) {
          model.unbound.fields[association.alias] = {
            type: new graphql.GraphQLList(throughs[model.attributes[association.alias].through + association.alias]),
            resolve (root) {
              return root[association.alias]
            }
          }
        } else {
          model.unbound.fields[association.alias] = {
            type: new graphql.GraphQLNonNull(new graphql.GraphQLList(models[association.collection].qlObject)),
            resolve (root) {
              return root[association.alias]
            }
          }
        }
      }
    }
    return model.qlObject
  },
  queryInputs (model, models, throughs, graphql) {
    // for type date and number we can have an input range
    // for strings we can have regexp
    let fields = {}
    for (let attrName in model.attributes) {
      let attribute = model.attributes[attrName]
        if (!attribute.collection) {
        fields[attrName] = {
          type: getSearchType(attribute, graphql)
        }
      }
    }

    // for (let i = 0; i < model.associations.length; i++) {
    //   let association = model.associations[i]
    //   if (association.type === 'model') {
    //     fields[attrName]
    //   }
    //   if (association.type === 'collection') {
    //   }
    // }

    fields.or = {
      type: new graphql.GraphQLList(new graphql.GraphQLInputObjectType({
        name: format.type(format.or(model.identity)),
        fields
      }))
    }
    return fields
  },
  inputAttributes (model, graphql) {
    let fields = {}
    for (let attrName in model.attributes) {
      let attribute = model.attributes[attrName]
      if (!attribute.collection && !attribute.model) {
        fields[attrName] = {
          type: getType(attribute, attrName, graphql)
        }
      }
    }
    return {
      name: format.type(format.input(format.capInitial(model.identity))),
      fields
    }
  },
  inputThrough (model, models, graphql) {
    // must not loop and retuen 1 result, better names are needed
    let throughs = {}
    for (let i = 0; i < model.associations.length; i++) {
      let association = model.associations[i]
      if (association.type === 'collection') {
        if (association.via && model.attributes[association.alias].through) {
          throughs[model.attributes[association.alias].through + association.alias] = new graphql.GraphQLInputObjectType({
            name: format.type(format.input(format.capInitial(model.attributes[association.alias].through) + format.capInitial(association.alias))),
            fields: _.merge(_.merge({}, models[association.collection].unboundInput.fields), models[model.attributes[association.alias].through].unboundInput.fields)
          })
        }
      }
    }
    return throughs
  },
  inputAssociations (model, models, throughs, graphql) {
    for (let i = 0; i < model.associations.length; i++) {
      let association = model.associations[i]
      if (association.type === 'model') {
        if (model.attributes[association.alias].required) {
          model.unboundInput.fields[association.alias] = {
            type: new graphql.GraphQLNonNull(models[association.model].qlInputObject)
          }
        } else {
          model.unboundInput.fields[association.alias] = {
            type: models[association.model].qlInputObject
          }
        }
      }
      if (association.type === 'collection') {
        if (association.via && !model.attributes[association.alias].through && models[association.collection].attributes[association.via].required) {
          model.unboundInput.fields[association.alias] = {
            type: new graphql.GraphQLList(new graphql.GraphQLNonNull(models[association.collection].qlInputObject))
          }
        }
        if (association.via && model.attributes[association.alias].through) {
          model.unboundInput.fields[association.alias] = {
            type: new graphql.GraphQLList(throughs[model.attributes[association.alias].through + association.alias])
          }
        } else {
          model.unboundInput.fields[association.alias] = {
            type: new graphql.GraphQLList(models[association.collection].qlInputObject)
          }
        }
      }
    }
    return model.qlInputObject
  }
}
