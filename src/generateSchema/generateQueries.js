module.exports = (model, graphql) => {
  const single = {
    type: model.qlObject,
    args: model.qlQueryIntputs,
    async resolve (root, args, context, info) {
      if (!Object.keys(args).length) {
        return new Error(`must provide at least one parameter in '${Object.keys(model.qlQueryIntputs)}'`)
      }
      console.log(args)
      // check context also before populating
      try {
        let query = model.findOne(args)
        for (let i = 0; i < model.associations.length; i++) {
          query = query.populate(model.associations[i].alias)
        }
        return await query
      } catch (e) {
        return e
      }
    }
  }

  const plurial = {
    type: new graphql.GraphQLList(model.qlObject),
    args: Object.assign(Object.assign({}, model.qlQueryIntputs), graphql.internalPagination),
    async resolve (root, args, context, info) {
      let skip = 0
      let limit = 30
      if (args.first) {
        limit = args.first
      } else if (args.last) {
        limit = args.last
        args.sortType = args.sortType === 'DESC' ? 'ASC' : 'DESC'
      } else {
        limit = args.items
        skip = args.items * (args.page - 1)
      }
      const sort = `${args.sortBy} ${args.sortType}`
      const where = _.omit(args, ['first', 'last', 'page', 'items', 'sortBy', 'sortType'])
      // check context also before populating
      try {
        let query = model.find({where, sort, skip, limit})
        for (let i = 0; i < model.associations.length; i++) {
          query = query.populate(model.associations[i].alias)
        }
        return await query
      } catch (e) {
        return e
      }
    }
  }

  return {single, plurial}
}
