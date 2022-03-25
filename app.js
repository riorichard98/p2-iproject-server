if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const multer  = require('multer')
const app = express()
const port = process.env.PORT || 3000
const allRoutes = require('./routes/index.js')
const cors = require('cors')
const { createServer } = require("http");
const { Server } = require("socket.io");
const { ChatController } = require('./controllers/chatController.js')
const httpServer = createServer(app);
const {FriendRequest} = require('./models/index.js')

const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', allRoutes)
// app.listen(port, () => {
//     console.log(`Listening on port ${port}`)
// })

io.on("connection", (socket) => {
    console.log(`client socket with id ${socket.id} enter the server`);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })

    //joining on my own room
    socket.on('joinMyOwnRoom',(MyId)=>{
        console.log(`${socket.id} enter room ${MyId}`);
        socket.join(MyId)
    })

    //joining on my friends room
    socket.on('joinMyFriendsRoom',(friendsIds)=>{
        const rooms = friendsIds
        socket.join(rooms)
    })

    //broadcast posts in my own room
    socket.on('broadcastPost',(post,myId)=>{
        io.to(myId).emit('updatePosts',post)
    })
    
    socket.on('gettingAllMessage', async (senderId, receiverId, senderName) => {
        try {
            const RoomId1 = senderId + '&' + receiverId
            const RoomId2 = receiverId + '&' + senderId
            const chats1 = await ChatController.readAllChat(RoomId1)
            const chats2 = await ChatController.readAllChat(RoomId2)
            if (chats1.length) {
                socket.join(RoomId1)
                io.to(RoomId1).emit('receiveChats', chats1,RoomId1)
            } else if (chats2.length) {
                socket.join(RoomId2)
                io.to(RoomId2).emit('receiveChats', chats2,RoomId2)
            }else{
                socket.join(RoomId1)
                await ChatController.createChat(RoomId1, senderName,null)
                io.to(RoomId1).emit('receiveChats', [],{RoomId:RoomId1})
            }
        } catch (error) {

        }
    })

    socket.on('sendMessage', async (RoomId, sender,chat) => {
        try {
            await ChatController.createChat(RoomId, sender,chat)
            io.to(RoomId).emit('updateChat', chat)
        } catch (error) {
            
        }
    })

    socket.on('sendFriendRequest',async(fromName,fromId,toId)=>{
        try {
            const friendRequest = await FriendRequest.create({fromName,fromId,toId})
            io.to(toId).emit('pendingRequest',friendRequest)
        } catch (error) {
            
        }
    })
})

httpServer.listen(3000, () => {
    console.log('server running');
});