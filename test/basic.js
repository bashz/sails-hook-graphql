const fs = require('fs')
const Sails = require('sails').Sails
const supertest = require('supertest')
const champs = require('./data/champs')
const items = require('./data/items')

const fillData = async (log) => {
  log.debug('│   ├── Adding flat Items')
  for (let i = 0; i < items.length; i++) {
    let item = items[i]
    let tags = []
    for (let j = 0; j < item.tags.length; j++) {
      if (!j && !i) log.debug('│   │   └── Adding Items Tags')
      let tag = item.tags[j]
      try {
        let tagged = await Tag.findOrCreate({ name: tag }, { name: tag })
        tags.push(tagged.id)
      } catch (e) {
        return e
      }
    }
    try {
      await Item.create({
        name: item.name,
        key: parseInt(item.key),
        price: item.price,
        totalPrice: item.timeout,
        stats: item.stats,
        tags
      })
    } catch (e) {
      return e
    }
  }
  log.debug('│   ├── linking Items')
  for (let i = 0; i < items.length; i++) {
    let item = items[i]
    try {
      let from = await Item.find({ key: item.from })
      await Item.update({ key: item.key }).set({ from: from.map(composite => composite.id) })
    } catch (e) {
      return e
    }
  }
  log.debug('│   ├── Adding Champions')
  for (let i = 0; i < champs.length; i++) {
    let champ = champs[i]
    let tags = []
    let skins = []
    for (let j = 0; j < champ.tags.length; j++) {
      if (!j && !i) log.debug('│   │   ├── Adding Champions Tags')
      let tag = champ.tags[j]
      try {
        let tagged = await Tag.findOrCreate({ name: tag }, { name: tag })
        tags.push(tagged.id)
      } catch (e) {
        return e
      }
    }
    for (let j = 0; j < champ.skins.length; j++) {
      if (!j && !i) log.debug('│   │   ├── Adding Skins')
      let skin = champ.skins[j]
      try {
        let worn = await Skin.create({
          name: skin.name,
          chromas: skin.chromas,
          image: `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ.name}_${skin.num}.jpg`
        }).fetch()
        skins.push(worn.id)
      } catch (e) {
        return e
      }
    }
    try {
      let image = fs.readFileSync(`./test/data/pics/${champ.name}.png`, 'binary')
      if (!i) log.debug('│   │   └── Adding Statistics of Champions')
      let stats = await Stats.create(champ.stats).fetch()
      await Champion.create({
        name: champ.name,
        title: champ.title,
        image: image,
        resource: champ.resource,
        skins,
        tags,
        stats: stats.id
      })
    } catch (e) {
      return e
    }
  }
  log.debug('│   └── Finding recommended items for champions')
  for (let i = 0; i < champs.length; i++) {
    let champ = champs[i]
    try {
      let champion = await Champion.findOne({ name: champ.name })
      for (let j = 0; j < champ.recommended.length; j++) {
        let recommended = champ.recommended[j]
        let item = await Item.findOne({ key: recommended.key })
        if (champion && item) {
          await Recommended.create({
            map: recommended.map,
            mode: recommended.mode,
            type: recommended.type,
            item: item.id,
            champion: champion.id
          })
        }
      }
    } catch (e) {
      return e
    }
  }
  return null
}

describe('Basic tests', () => {
  var sails
  before(done => {
    // this.timeout(30000)
    Sails().lift({
      appPath: __dirname + '/instance',
      hooks: {
        "sails-hook-graphql": require('../'),
        "grunt": false,
        "pubsub": false,
        "session": false,
        "views": false,
        "i18n": false
      },
      models: { migrate: 'drop' },
      log: { level: 'debug' }
    }, async (err, _sails) => {
      if (err) {
        return done(err)
      }
      _sails.log.debug('Mock')
      _sails.log.debug('├── Start Adding data')
      err = await fillData(_sails.log)
      if (err) {
        _sails.log.error(new Error('Error while creating mocked data'))
        return done(err)
      }
      _sails.log.debug('└── Done adding data')
      sails = _sails
      return done()
    })
  })

  after(done => {
    if (sails) {
      return sails.lower(done)
    }
    return done()
  })

  it('Hits the configured route', done => {
    supertest(sails.hooks.http.app)
      .post('/graphql')
      .send({ query: '{champion (name: Nunu) { title items {name} } }' })
      .expect((res) => {
        console.log(res.body)
      })
      .expect(200, done)
  })
})
