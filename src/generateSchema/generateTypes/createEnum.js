const format = require('../../utils/namingFormats')

module.exports = createEnum = function (arrayEnum) {
  let objectEnum = {}
  for (let i = 0; i < arrayEnum.length; i++) {
    objectEnum[format.capAll(arrayEnum[i])] = {value: arrayEnum[i]}
  }
  return objectEnum
}
