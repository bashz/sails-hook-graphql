const supertest = require('supertest')
const chai = require('chai')

const expect = chai.expect;

describe('Queries', () => {
  it('Single record query', done => {
    supertest(sails.hooks.http.app)
      .post('/test-graphql')
      .send({
        query: '{champion (name: Aatrox) {id name }}',
        variables: null
      })
      .expect(res => {
        expect(res.body.data).to.have.property('champion')
        expect(res.body.data.champion).to.have.property('name')
        expect(res.body.data.champion.name).to.equal('Aatrox')
      })
      .expect(200, done)
  })

  it('Multi record query', done => {
    supertest(sails.hooks.http.app)
      .post('/test-graphql')
      .send({
        query: '{champions {id name}}',
        variables: null
      })
      .expect(res => {
        expect(res.body.data).to.have.property('champions')
        expect(res.body.data.champions.length).to.equal(30)
      })
      .expect(200, done)
  })
})
