module.exports = {
  enumName (name) {
    return name.replace(/^\d/, c => `_${c}`)
    .replace(/\W/g, '_')
    .replace(/_+/g, '_')  
  },
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
  },
  create (name) {
    return 'create' + this.capInitial(name)
  },
  update (name) {
    return 'update' + this.capInitial(name)
  },
  remove (name) {
    return 'delete' + this.capInitial(name)
  }
}
