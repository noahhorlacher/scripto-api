const express = require("express")
const helmet = require("helmet")
const cors = require('cors')
const app = express()
const port = 3000

// routers
const writingRouter = require('./routes/writing')
const imageRouter = require('./routes/images')

// middleware
app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
)
// security, enable cross origin
app.use(helmet({ crossOriginResourcePolicy: false }))

// cors
app.use(cors())

// static folder
app.use('/public/uploads', express.static('public/uploads'))

// standard response
app.get('/api/v1', (req, res) => {
    res.send('bee-unlimited API v1.0.0');
})

// API routes
app.use('/api/v1/writing', writingRouter)
app.use('/api/v1/image', imageRouter)

// error handling
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    console.error(err.message, err.stack)
    res.status(statusCode).json({ message: err.message })
    return
})

// start
app.listen(port, () => {
    console.log(`bee-unlimited API listening at http://localhost:${port}`)
})