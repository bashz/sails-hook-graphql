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
      graphql: { route: '/test-graphql', schemaRoute: '/test-graphql-schema', enableSchemaRoute: true }
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
      .send({ query: 'query IntrospectionQuery {__schema {queryType { name } mutationType { name } subscriptionType { name } } }' })
      .expect(res => {
        expect(res.body).to.exist
        expect(res.body.data).to.exist
        expect(res.body.data.__schema).to.be.an('object')
        expect(res.body.data.__schema).to.have.property('queryType')
        expect(res.body.data.__schema).to.have.property('mutationType')
        expect(res.body.data.__schema).to.have.property('subscriptionType')
      })
      .expect(200, done)
  })
  it('Hits the schema route', done => {
    supertest(sails.hooks.http.app)
      .get('/test-graphql-schema')
      .expect('content-type', 'text/plain; charset=utf-8')
      .expect(res => {
        expect(res).to.have.property('text')
      })
      .expect(200, done)
  })

  it('Updates a record', done => {
    supertest(sails.hooks.http.app)
      .post('/test-graphql')
      .send({
        "query": "mutation { updateChampion(name: \"Aatrox\", input: {name: \"New Aatrox\"}) {id name}}",
        "variables": null
      })
      .expect(res => {
        expect(res.body.data).to.have.property('updateChampion')
        expect(res.body.data.updateChampion[0].name).to.equal("New Aatrox")
      })
      .expect(200, done)
  })

  it('Single record query', done => {
    supertest(sails.hooks.http.app)
      .post('/test-graphql')
      .send({
        "query": "{champion(name: \"Aatrox\") {id name}}",
        "variables": null
      })
      .expect(res => {
        expect(res.body.data).to.have.property('champion')
        expect(res.body.data.champion).to.have.property('name')
        expect(res.body.data.champion.name).to.equal("Aatrox")
      })
      .expect(200, done)
  })

  it('Multi record query', done => {
    supertest(sails.hooks.http.app)
      .post('/test-graphql')
      .send({
        "query": "{champions {id name}}",
        "variables": null
      })
      .expect(res => {
        expect(res.body.data).to.have.property('champions')
        expect(res.body.data.champions.length).to.equal(30)
      })
      .expect(200, done)
  })

})
