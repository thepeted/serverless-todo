const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const AWS = require('aws-sdk')
const uuidv1 = require('uuid/v1')

const generateUpdateParams = require('./utils/generateUpdateParams')
const isValidBody = require('./utils/isValidBody')

const TODOS_TABLE = process.env.TODOS_TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient()

app.use(bodyParser.json({ strict: false }))

// Get all todos
app.get('/todos', (req, res) => {
  const params = {
    TableName: TODOS_TABLE
  }

  dynamoDb.scan(params, (error, data) => {
    if (error) {
      console.log(error)
      return res.status(404).json({ error: 'Could not get todos' })
    } else {
      return res.json(data.Items)
    }
  })
})

// Get a single todo
app.get('/todos/:todoId', (req, res) => {
  const { todoId } = req.params
  const params = {
    TableName: TODOS_TABLE,
    Key: {
      todoId: todoId
    }
  }

  dynamoDb.get(params, (error, data) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ error: 'Could not get todo' })
    }

    if (!data.Item) {
      return res.status(404).json({ error: 'Could not find todo with id: ' + todoId })
    }

    return res.json(data.Item)
  })
})

// Create todo
app.post('/todos', (req, res) => {
  const { completed = false, text } = req.body

  // validate body
  if (text === undefined || !isValidBody(req.body)) {
    return res.status(400).json({ error: 'request body must contain valid "completed" and "text" values' })
  }

  const item = {
    todoId: uuidv1(),
    timestamp: new Date().getTime(),
    completed,
    text
  }
  const params = {
    TableName: TODOS_TABLE,
    Item: item
  }

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error)
      return res.status(400).json({ error: 'Could not create todo' })
    }
    res.json(item)
  })
})

// Update todo
app.put('/todos/:todoId', (req, res) => {
  if (!isValidBody(req.body)) {
    return res.status(400).json({ error: 'request body must contain valid values' })
  }
  const { todoId } = req.params

  const params = {
    TableName: TODOS_TABLE,
    Key: {
      todoId
    },
    ConditionExpression: 'attribute_exists(todoId)',
    ReturnValues: 'UPDATED_NEW',
    ...generateUpdateParams(req.body)
  }

  dynamoDb.update(params, (error, data) => {
    if (error) {
      console.log(error)
      const message =
        error.code === 'ConditionalCheckFailedException'
          ? 'could not find item with id: '
          : 'could not update item with id: '

      return res.status(400).json({ error: message + todoId })
    } else {
      return res.json(data.item)
    }
  })
})

// Delete todo
app.delete('/todos/:todoId', (req, res) => {
  const { todoId } = req.params
  const params = {
    TableName: TODOS_TABLE,
    Key: {
      todoId
    },
    ConditionExpression: 'attribute_exists(todoId)'
  }

  dynamoDb.delete(params, (error) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ error: 'Could not delete todo with id: ' + todoId })
    }
    return res.sendStatus(204)
  })
})

module.exports.handler = serverless(app)
