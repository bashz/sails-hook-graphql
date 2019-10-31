const graphql = require('graphql')
const generateSchema = require('./src/generateSchema')

const register = function (schema) {
  sails.registerAction(async (req, res) => {
    if(!req.body || !req.body.query) {
      return res.badRequest(new Error('Missing query'))
    }
    try {
      const result = await graphql.graphql(
        schema,
        req.body.query,
        null,
        {
          request: sails.request,
          reqData: {
            headers: req.headers
          }
        },
        req.body.variables
      )
      
      // error returned by graphql schema
      if (result.errors && result.errors.length) {
        return res.serverError(result)
      }
      return res.json(result)
    } catch (e) {
      // error returned by sails
      return res.serverError(result)
    }
  }, 'graphql')
}

const registerSchemaAction = function (schema) {
  sails.registerAction(async (req, res) => {
    res.status(200)
    res.type('text/plain')
    return res.send(graphql.printSchema(schema))
  }, 'graphql-schema')
}

module.exports = function (sails) {
  return {
    defaults() {
      return {
        graphql: {
          models: '*',
          route: '/graphql',
          schemaRoute: '/schema',
          enableSchemaRoute: true
        },
        __configKey__: {
          models: '*',
          route: '/graphql',
          schemaRoute: '/schema',
          enableSchemaRoute: true
        }
      }
    },
    configure() {
      sails.config[this.configKey] = Object.assign(sails.config[this.configKey] || {}, sails.config.graphql)
    },
    initialize(cb) {
      sails.after(['hook:orm:loaded'], () => {
        // get rid of non relevant models like many to many mandatory
        // those models have a sails schema, but we must keep through
        // models as they carry informations
        // could be done on 1 loop, on demand check I guess?
        let throughs = []
        for (model in sails.models) {
          for (attrName in sails.models[model].attributes) {
            if (sails.models[model].attributes[attrName].through) {
              throughs.push(sails.models[model].attributes[attrName].through)
            }
          }
        }
        let toOmit = []
        for (model in sails.models) {
          if (sails.models[model].hasSchema && throughs.indexOf(model) === -1) {
            toOmit.push(model)
          }
        }
        const schema = generateSchema(_.omit(sails.models, toOmit), graphql)

        register(schema)
        this.routes.before[sails.config[this.configKey].route] = { action: 'graphql' }

        if (sails.config[this.configKey].enableSchemaRoute) {
          registerSchemaAction(schema)
          this.routes.before[sails.config[this.configKey].schemaRoute] = { action: 'graphql-schema' }
        }
        return cb()
      })
    },
    registerActions(cb) {
      const schema = generateSchema(_.omit(sails.models, ['archive']), graphql)
      register(schema)
      if (sails.config[this.configKey].enableSchemaRoute) {
        registerSchemaAction(schema)
      }
      return cb()
    }
  }
}
