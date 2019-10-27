/**
 * Champion.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const resources = ['Blood Well', 'Mana', 'Energy', 'None', 'Rage', 'Courage', 'Shield', 'Fury', 'Ferocity', 'Heat', 'Crimson Rush', 'Flow']

module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true,
      unique: true
    },
    title: {
      type: 'string',
      minLength: 4,
      maxLength: 127
    },
    image: {
      type: 'ref'
    },
    resource: {
      type: 'string',
      isIn: resources
    },
    // associations
    skins: {
      collection: 'skin',
      via: 'champion'
    },
    tags: {
      collection: 'tag',
      via: 'champions'
    },
    stats: {
      model: 'stats',
      required: true
    },
    recommended: {
      collection: 'recommended',
      via: 'champion'
    },
    items: {
      collection: 'item',
      through: 'recommended',
      via: 'champion'
    }
  }
}
