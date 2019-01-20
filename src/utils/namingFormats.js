module.exports = {
  capInitial(name) {
    return name.replace(/^(\w)/, (match, cought) => cought.toUpperCase())
  },
  plurialize(name) {
    return name.replace(/(y)?$/, (match, cought) => {if(cought) return 'ies'; else return 's'})
  },
  type (name) {
    return name += 'Type';
  },
  inputs (name) {
    return name += 'InputType';
  },
  query (name) {
    return name += 'Query';
  }
}
