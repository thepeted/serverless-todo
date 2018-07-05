const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const AWS = require('aws-sdk')
const uuidv1 = require('uuid/v1')

const TODOS_TABLE = process.env.TODOS_TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient()

app.use(bodyParser.json({ strict: false }))

// Get all todos
app.get('/todos', function (req, res) {
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
app.get('/todos/:todoId', function (req, res) {
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
app.post('/todos', function (req, res) {
  const { completed, text } = req.body

  // validate body
  if (
    completed === undefined || text === undefined ||
    typeof completed !== 'boolean' || typeof text !== 'string'
  ) {
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

// Delete todo
app.delete('/todos/:todoId', function (req, res) {
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
