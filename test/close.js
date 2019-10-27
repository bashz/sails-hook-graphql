describe('Post testing', () => {
  it('Check if sails is still up', done => {
    if (!sails) {
      return done(new Error('sails crached and is no long here'))
    }
    return sails.lower(done)
  })
})
