const types = {
  todoId: 'string',
  completed: 'boolean',
  text: 'string'
}

module.exports = {
  ALLOWED_ATTRIBUTE_TYPES: types,
  ALLOWED_ATTRIBUTE_KEYS: Object.keys(types)
}
