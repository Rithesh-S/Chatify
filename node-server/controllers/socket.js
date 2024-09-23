const socketIo = require('socket.io');
const { addMessage , receiveMessage } = require('./chatifyController')

function initializeSocket(server) {
    const io = socketIo(server, {
        cors: {
            origin: 'https://chatify-hazel-tau.vercel.app/',
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        }
    })

    io.on('connection', (socket) => {

        console.log('New client connected:', socket.id)

        const messageFormatter = (conversation) => {
            const chats = {}
            conversation.forEach((val) => {
                const chatid = val.chatid
                const messages = val.messages
                messages.forEach((val) => {
                    const userid = val.userid
                    const message = val.message
                    const msgs = { userid , message }
                    if(!chats[chatid]) {
                        chats[chatid] = []
                    }
                    chats[chatid].push(msgs)
                })
            })
            return chats
        }
 
        socket.on('prevmessage',() => {
            const call = async () => {
                const data = await receiveMessage()
                const formatChat = messageFormatter(data)
                socket.emit('receiveprevmessage',formatChat)
            }
            call()
        })
 
        socket.on('message', (conversation,message,userid,room) => {
            addMessage(room,userid,message)
            const chatRooms = conversation
            const msg = { userid, message }
            if (!chatRooms[room]) {
                chatRooms[room] = []
            }
            chatRooms[room].push(msg) 
            io.sockets.in(room).emit('receive',chatRooms)
        })

        socket.on('joinroom',(room) => {
            if(room) {
                socket.join(room)
            }
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id)
        })
    })
    
    return io;
}

module.exports = {
    initializeSocket
}
