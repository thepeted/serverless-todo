const allowedTypes = require('../constants').ALLOWED_ATTRIBUTE_TYPES
const allowedKeys = require('../constants').ALLOWED_ATTRIBUTE_KEYS

module.exports = function isValidBody (body) {
  /* eslint-disable valid-typeof */
  if (typeof body !== 'object') return false

  let errors = []
  Object.keys(body)
    .filter(attr => allowedKeys.includes(attr))
    .forEach(attr => {
      if (typeof body[attr] !== allowedTypes[attr]) {
        errors.push(attr)
      }
    })

  return errors.length === 0
}
