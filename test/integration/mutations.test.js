const supertest = require('supertest')
const chai = require('chai')

const expect = chai.expect;

describe('Mutations', () => {
  it('Updates a record', done => {
    supertest(sails.hooks.http.app)
      .post('/test-graphql')
      .send({
        query: 'mutation { updateChampion (name: MonkeyKing, input: {name: "Wukong"}) {id name}}',
        variables: null
      })
      .expect(res => {
        expect(res.body.data).to.have.property('updateChampion')
        expect(res.body.data.updateChampion[0].name).to.equal('Wukong')
      })
      .expect(200, done)
  })
  it('Updates multi records', done => {
    supertest(sails.hooks.http.app)
      .post('/test-graphql')
      .send({
        query: 'mutation { updateItem (price: 300, input: {price: 500}) {id name} }',
        variables: null
      })
      .expect(res => {
        expect(res.body.data).to.have.property('updateItem')
        expect(res.body.data.updateItem).to.be.an('array')
        expect(res.body.data.updateItem).to.have.length.above(2)
      })
      .expect(200, done)
  })
})
