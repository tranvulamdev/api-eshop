const express = require('express')
const app = express()

// IMPORT
require('dotenv').config()
const morgan = require('morgan')
const db = require('./config/db')
const cors = require('cors')

// ENV
const connectionString = process.env.CONNECTION_STRING
const api = process.env.API_URL

// PORT
const port = process.env.PORT || 4000

// cho phép truy xuất, gọi api từ nhiều nguồn khác nhau. Google ->...
app.use(cors())
app.options('*', cors())

// MIDDLEWARE
// --- (body-parser) for parsing req.body ---
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// --- morgan ---
app.use(morgan('tiny'))

// CONNECT DATABASE
db.connect(connectionString)

// ROUTERS
const productsRouter = require('./routers/products')
const usersRouter = require('./routers/users')
const ordersRouter = require('./routers/orders')
const categoriesRouter = require('./routers/categories')

app.use(`${api}/products`, productsRouter)
app.use(`${api}/users`, usersRouter)
app.use(`${api}/orders`, ordersRouter)
app.use(`${api}/categories`, categoriesRouter)

// RUN
app.listen(port, () => {
    console.log('Server is running at https://localhost:' + port)
})
