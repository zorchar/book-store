const express = require('express')
const cors = require('cors')
const path = require('path')
const hbs = require('hbs')

const port = process.env.PORT
require('./db/mongoose')

const userRouter = require('./routers/userRouter')
const bookRouter = require('./routers/bookRouter')
const authorRouter = require('./routers/authorRouter')
const adminRouter = require('./routers/adminRouter')
const errorHandler = require('./middleware/errorHandler')

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const app = express()
app.use(cors())
app.use(express.json())

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))
app.use(bookRouter)
app.use(authorRouter)
app.use(adminRouter)
app.use(userRouter)
app.use(errorHandler)

app.all("*", (req, res) => {
    res.status(400).render('error-page')
})

app.listen(port, () => {
    console.log('Server connected, port:', port)
})
