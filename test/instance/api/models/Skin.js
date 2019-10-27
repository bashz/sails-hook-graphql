/**
 * Skin.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    name: {
      type: 'string',
      defaultsTo: 'default'
    },
    chromas: {
      type: 'boolean',
      defaultsTo: false
    },
    image: {
      type: 'string',
      isURL: true
    },
    // association
    champion: {
      model: 'champion'
    }
  }
}
