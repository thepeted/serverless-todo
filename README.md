# Serverless Todo API Service

## Description
A [Serverless](https://serverless.com) RESTful API built with express.js for managing a list of "todos" stored in an AWS Dynamo DB. 

## Example API Usage

`$ curl {BASE_DOMAIN}/todos/`
returns all todos
```
[
  {
    "completed": true,
    "todoId": "6a436cd0-809b-11e8-800d-f7533ca38f29",
    "text": "do something awesome",
    "timestamp": 1530826562589
  }
]

```
add a todo:
```
$ curl -H "Content-Type: application/json" -X POST ${BASE_DOMAIN}/todos -d '{"completed": true, "text": "use uuid"}'`
```
fetch a single todo:
```
curl {BASE_DOMAIN}/todos/{id}
```

delete a todo:
```
curl -X DELETE {BASE_DOMAIN}/todos/{id}
```

## Build and Deploy

```
npm install -g serverless
npm install
serverless deploy
```