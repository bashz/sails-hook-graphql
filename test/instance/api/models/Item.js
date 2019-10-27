/**
 * Item.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true,
      minLength: 2
    },
    key: {
      type: 'number',
      required: true,
      unique: true
    },
    price: {
      type: 'number',
      defaultsTo: 0,
      isInteger: true
    },
    totalPrice: {
      type: 'number',
      isInteger: true
    },
    stats: {
      type: 'json',
      defaultsTo: {}
    },
    // associations
    into: {
      collection: 'item',
      via: 'from'
    },
    from: {
      collection: 'item',
      via: 'into'
    },
    tags: {
      collection: 'tag',
      via: 'items'
    },
    recommended: {
      collection: 'recommended',
      via: 'item'
    },
    champions: {
      collection: 'champion',
      through: 'recommended',
      via: 'item'
    }
  }
}
