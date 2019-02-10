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
      // const u = await Organization.create({name: 'org'}).fetch()
      // const v = await Project.create({name: 'pro', organization: 1}).fetch()
      // console.log(u, v)
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
      // .send({query: 'mutation {createOrganization (input: {name: "sworm"}) {id name}}'})
      .send({query: 'mutation {updateOrganization (id: 4, input: {name: "sworme"}) {id name createdAt updatedAt profile{displayName}}}'})
      // .send({query: 'mutation {deleteOrganization (id: 3) {id}}'})
      .expect((res) => {
        console.log(res.body)
      })
      .expect(200, done)
    // supertest(sails.hooks.http.app)
    //   .post('/graphql')
    //   .send({query: '{profiles (last: 1) {id displayName age}}'})
    //   .expect((res) => {
    //     console.log(res.body)
    //   })
    //   .expect(200, done)
  })
})
