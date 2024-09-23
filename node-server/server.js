require('dotenv').config();
const express = require('express')
const cors = require('cors')
const http = require('http');
const chatifyRoutes = require('./routes/chatifyRoutes')
const socket = require('./controllers/socket')

const corsOptions = {
    origin: 'https://chatify-5zrh0s5h5-rithesh-ss-projects.vercel.app/',
    methods: ['GET', 'POST', 'PUT', 'DELETE' ],
}

const app = express()

app.use(express.json())
app.use(cors(corsOptions))

const server = http.createServer(app)

socket.initializeSocket(server)

app.use('/chatify', chatifyRoutes)

const port = process.env.PORT || 2000

server.listen(port,() => {
    console.log(`Listening to the port ${port}`)
})

module.exports = app;
