module.exports = (model, graphql) => {
  const single = {
    type: model.qlObject,
    args: model.qlQueryIntputs.fields,
    async resolve (root, args, context, info) {
      if (!Object.keys(args).length) {
        return new Error(`must provide at least one parameter in '${Object.keys(model.qlQueryIntputs.fields)}'`)
      }
      try {
        return await model.findOne(args)
      } catch (e) {
        return e
      }
    }
  }

  const plurial = {
    type: new graphql.GraphQLList(model.qlObject),
    args: model.qlQueryIntputs.fields,
    async resolve (root, args, context, info) {
      try {
        return await model.find(args)
      } catch (e) {
        return e
      }
    }
  }

  return {single, plurial}
}
