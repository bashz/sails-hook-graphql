module.exports = {
  capAll (name) {
    return name.toUpperCase()
  },
  capInitial (name) {
    return name.replace(/^(\w)/, (match, cought) => cought.toUpperCase())
  },
  plurialize (name) {
    return name.replace(/(y)?$/, (match, cought) => {if(cought) return 'ies'; else return 's'})
  },
  type (name) {
    return name += 'Type';
  },
  input (name) {
    return name += 'Input';
  },
  query (name) {
    return name += 'Query';
  }
}
