const express = require('express')
const cors = require('cors')
const path = require('path')

const port = process.env.PORT
require('./db/mongoose')
const userRouter = require('./routers/userRouter')
const bookRouter = require('./routers/bookRouter')
const authorRouter = require('./routers/authorRouter')
const adminRouter = require('./routers/adminRouter')
const publicDirectoryPath = path.join(__dirname, '../public')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(publicDirectoryPath))
app.use(userRouter)
app.use(bookRouter)
app.use(authorRouter)
app.use(adminRouter)


app.listen(port, () => {
    console.log('Server connected, port:', port)
})
