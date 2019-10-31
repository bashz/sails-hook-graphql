module.exports = (model, graphql) => {
  // model.qlInputObject = new graphql.GraphQLInputObjectType({
  //   name: format.type(format.input(model.identity)),
  //   fields: model.unbound.fields
  // })
  const create = {
    type: model.qlObject,
    args: { input: { type: model.qlInputObject } },
    async resolve(root, args, context, info) {
      // check context also before populating
      try {
        let query = model.create(args.input).fetch()
        // Must do 2 step query to be able to populate (same goes for update and delete)
        // for (let i = 0; i < model.associations.length; i++) {
        //   query = query.populate(model.associations[i].alias)
        // }
        return await query
      } catch (e) {
        return e
      }
    }
  }
  
  const update = {
    type: new graphql.GraphQLList(model.qlObject),
    // must strip all nullability
    args: Object.assign(Object.assign({}, model.qlQueryIntputs), {input: { type: model.qlInputObject }}),
    //{critireas: {type: new graphql.GraphQLInputObjectType({name: model.identity + 'kkk', fields: model.qlQueryIntputs})}, input: { type: model.qlInputObject } },
    async resolve(root, args, context, info) {
      // next ligne is false
      if (!Object.keys(args).length) {
        return new Error(`must provide at least one parameter in '${Object.keys(model.qlQueryIntputs)}'`)
      }
      // check context also before populating
      try {
        let query = model.update(_.omit(args, ['input'])).set(args.input).fetch()
        // for (let i = 0; i < model.associations.length; i++) {
        //   query = query.populate(model.associations[i].alias)
        // }
        return await query
      } catch (e) {
        return e
      }
    }
  }

  const remove = {
    type: new graphql.GraphQLList(model.qlObject),
    args: model.qlQueryIntputs,
    async resolve(root, args, context, info) {
      if (!Object.keys(args).length) {
        return new Error(`must provide at least one parameter in '${Object.keys(model.qlQueryIntputs)}'`)
      }
      // check context also before populating
      try {
        let query = model.destroy(args).fetch()
        // for (let i = 0; i < model.associations.length; i++) {
        //   query = query.populate(model.associations[i].alias)
        // }
        return await query
      } catch (e) {
        return e
      }
    }
  }
  return { create, update, remove }
}
