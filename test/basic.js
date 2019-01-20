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
        "grunt": false
      },
      models: { migrate: 'drop'},
      log: { level: "silly" }
    }, function (err, _sails) {
      if (err) return done(err)
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
      .get('/graphql')
      .expect((res) => {
        res.body = 'Hey'
      })
      .expect(200, done)
  })
})
