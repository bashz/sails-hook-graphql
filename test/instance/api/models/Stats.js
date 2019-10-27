/**
 * Stats.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    hp: {
      type: 'number',
      min: 100
    },
    hpperlevel: {
      type: 'number'
    },
    mp: {
      type: 'number'
    },
    mpperlevel: {
      type: 'number'
    },
    movespeed: {
      type: 'number'
    },
    armor: {
      type: 'number'
    },
    armorperlevel: {
      type: 'number'
    },
    spellblock: {
      type: 'number'
    },
    spellblockperlevel: {
      type: 'number'
    },
    attackrange: {
      type: 'number'
    },
    hpregen: {
      type: 'number'
    },
    hpregenperlevel: {
      type: 'number'
    },
    mpregen: {
      type: 'number'
    },
    mpregenperlevel: {
      type: 'number'
    },
    crit: {
      type: 'number',
      max: 100
    },
    critperlevel: {
      type: 'number',
      min: 0,
      max: 100
    },
    attackdamage: {
      type: 'number'
    },
    attackdamageperlevel: {
      type: 'number'
    },
    attackspeedperlevel: {
      type: 'number'
    },
    attackspeed: {
      type: 'number'
    },
    // associations
    champion: {
      model: 'champion',
      required: false
    }
  }
}
