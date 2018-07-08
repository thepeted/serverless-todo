const allowedTypes = require('../constants').ALLOWED_ATTRIBUTE_TYPES
const allowedKeys = require('../constants').ALLOWED_ATTRIBUTE_KEYS
const validateUuid = require('uuid-validate')

module.exports = function isValidBody (body) {
  /* eslint-disable valid-typeof */
  if (typeof body !== 'object') return false

  // if id is supplied, ensure it is a valid uuid
  if (body.todoId && !validateUuid(body.todoId)) {
    return false
  }

  // check types
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
