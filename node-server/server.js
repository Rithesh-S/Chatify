require('dotenv').config();
const express = require('express')
const cors = require('cors')
const chatifyRoutes = require('./routes/chatifyRoutes')
const socket = require('./controllers/socket')

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE' ],
}

const app = express()

app.use(express.json())
app.use(cors(corsOptions))

const socketport = process.env.SOCKET_PORT || 1601
socket.initializeSocket(socketport)

app.use('/chatify', chatifyRoutes)

const port = process.env.PORT || 2000

app.listen(port,() => {
    console.log(`Listening to the port ${port}`)
})

module.exports = app;
