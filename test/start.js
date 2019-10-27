const Sails = require('sails').Sails
const supertest = require('supertest')
const chai = require('chai')
const fillData = require('./data/fillData')

const expect = chai.expect;

describe('Pre testing', () => {
  var sails
  before(done => {
    // this.timeout(30000)
    Sails().lift({
      appPath: __dirname + '/instance',
      hooks: {
        "sails-hook-graphql": require('..'),
        "grunt": false,
        "pubsub": false,
        "session": false,
        "views": false,
        "i18n": false
      },
      models: { migrate: 'drop' },
      log: { level: 'debug' },
      graphql: { route: '/test-graphql' }
    }, async (err, _sails) => {
      if (err) {
        return done(err)
      }
      err = await fillData(_sails.log)
      if (err) {
        _sails.log.error(new Error('Error while creating mocked data'))
        return done(err)
      }
      sails = _sails
      return done()
    })
  })

  it('Hits the configured route', done => {
    supertest(sails.hooks.http.app)
      .post('/test-graphql')
      .send({})
      .expect(res => expect(res.body).to.have.property('errors'))
      .expect(200, done)
  })
})
