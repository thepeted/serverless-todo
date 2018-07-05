const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const AWS = require('aws-sdk')

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
      return res.send(404).json({ error: 'Could not get todos' })
    } else {
      return res.json(data.Items)
    }
  })
})

// Create todo
app.post('/todos', function (req, res) {
  const { todoId, completed, text } = req.body

  // validate body
  if (
    todoId === undefined || completed === undefined || text === undefined ||
    typeof todoId !== 'string' || typeof completed !== 'boolean' || typeof text !== 'string'
  ) {
    return res.status(400).json({ error: 'request body must contain valid "todoId", "completed" and "text" values' })
  }

  const timestamp = new Date().getTime()
  const item = { todoId, timestamp, completed, text }

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

module.exports.handler = serverless(app)
