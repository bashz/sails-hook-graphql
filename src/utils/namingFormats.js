module.exports = {
  capAll (name) {
    return name.toUpperCase()
  },
  capInitial (name) {
    return name.replace(/^(\w)/, (match, caught) => caught.toUpperCase())
  },
  plurialize (name) {
    return name.replace(/(y)?$/, (match, caught) => {if(caught) return 'ies'; return 's'})
  },
  type (name) {
    return name += 'Type'
  },
  input (name) {
    return name += 'Input'
  },
  query (name) {
    return name += 'Query'
  },
  or (name) {
    return 'or' + this.capInitial(name)
  }
}
