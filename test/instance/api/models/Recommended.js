/**
 * Recommended.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const maps = ['3', 'HA', 'CrystalScar', 'SR', 'SL', 'TT', 'CityPark', 'ProjectSlums', 'Odyssey', 'any']
const modes = ['ARAM', 'ODIN', 'FIRSTBLOOD', 'KINGPORO', 'SIEGE', 'GAMEMODEX', 'CLASSIC', 'INTRO', 'TUTORIAL_MODULE_2', 'TUTORIAL_MODULE_3', 'STARGUARDIAN', 'TUTORIAL', 'PROJECT', 'ODYSSEY', 'any', 'ASCENSION']

module.exports = {
  attributes: {
    map: {
      type: 'string',
      isIn: maps
    },
    mode: {
      type: 'string',
      isIn: modes,
      allowNull: true
    },
    type: {
      type: 'string',
      allowNull: true
    },
    // associations
    item: {
      model: 'item',
      required: true
    },
    champion: {
      model: 'champion',
      required: true
    }
  }
}
