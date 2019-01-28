const graphql = require('graphql')
const generateSchema = require('./src/generateSchema')

const register = function (sails) {
  sails.registerAction((req, res) => {
    return res.status(200).send('Hey')
  }, 'graphql')
}

module.exports = function (sails) {
  return {
    defaults(config) {
      return {
        graphql: {
          models: '*',
          route: '/graphql'
        },
        __configKey__: {
          models: '*',
          route: '/graphql'
        }
      }
    },
    configure () {
      if (!sails.config[this.configKey]) {
        return sails.config[this.configKey] = {route: '/graphql', models: '*'}
      }
      if(!sails.config[this.configKey].route) {
        sails.config[this.configKey].route = '/graphql'
      }
      if(!sails.config[this.configKey].models) {
        sails.config[this.configKey].models = '*'
      }
    },
    initialize (cb) {
      sails.after(['hook:orm:loaded'], () => {
        let toOmit = []
        for (model in sails.models) {
          if (sails.models[model].hasSchema) {
            toOmit.push(model)
          }
        }
        const schema = generateSchema(_.omit(sails.models, toOmit), graphql)
        register(sails, schema)
        this.routes.before[sails.config[this.configKey].route] = {action: 'graphql'}
        return cb()
      })
    },
    registerActions(cb) {
      const schema = generateSchema(_.omit(sails.models, ['archive']), graphql)
        register(sails, schema)
      return cb()
    }
  }
}
