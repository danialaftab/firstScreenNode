const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')

const app = express()
const port = 3000

app.use(bodyParser.json())
routes(app)

app.listen(port, () => console.log(`App listening on port ${port}!`))