var Sails = require('sails').Sails
var supertest = require('supertest')

describe('Basic tests', function () {
  var sails
  before(function (done) {
    this.timeout(11000)
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
      models: { migrate: 'alter'},
      log: { level: 'debug' }
    }, async function (err, _sails) {
      // const u = await Profile.create({displayName: 'boss', age: 30}).fetch()
      // console.log(u)
      if (err) {
        return done(err)
      }
      sails = _sails
      return done()
    })
  })

  after(function (done) {
    if (sails) {
      return sails.lower(done)
    }
    return done()
  })

  it('Hits the configured route', function (done) {
    supertest(sails.hooks.http.app)
      .post('/graphql')
      .send({query: '{profile  {id displayName age}}'})
      // .send({query: '{profiles {id displayName age}}'})
      .expect((res) => {
        console.log(res.body)
      })
      .expect(200, done)
  })
})
