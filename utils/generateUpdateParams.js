const allowedKeys = require('../constants').ALLOWED_ATTRIBUTE_KEYS

module.exports = function generateUpateParams (updates = {}) {
  const keysToUpdate = Object.keys(updates).filter(key => allowedKeys.includes(key))

  const UpdateExpression = 'set ' + keysToUpdate
    .map(key => `#${key} = :${key}`)
    .join(', ')

  let ExpressionAttributeValues = {}
  keysToUpdate.forEach(key => {
    ExpressionAttributeValues[':' + key] = updates[key]
  })

  let ExpressionAttributeNames = {}
  keysToUpdate.forEach(key => {
    ExpressionAttributeNames['#' + key] = key
  })

  return {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  }
}
