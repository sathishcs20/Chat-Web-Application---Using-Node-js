const http =require("http")
const express=require('express')
const socketio=require('socket.io')
const app =express()
const server = http.createServer(app)
const io= socketio(server)
const {generateMessage,generateLocationMessage}=require("./utils/generateMsg")
app.use(express.static("../public"))
const{addUser,removeUser,getUser,getUsersInRoom}=require("./utils/user")


io.on("connection",(socket)=>
{
    // socket.broadcast.emit("message",generateMessage("New user joined")) //broadcast.emit will emit the message to all the connections except the one joined

    socket.on("join",({username,room},callback)=>
    {
        const {error,user} =addUser({id:socket.id,username,room})
        
        if(error)
        {
            return callback(error)
        }
        socket.join(user.room)
        socket.broadcast.to(user.room).emit("message",generateMessage("Admin",user.username+" joined")) 
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()
        //io.emit           socket.broadcast.emit
        //io.to().smit      socket.broadcast.to().smit  these two will emit messages to a particular room
    })
    socket.on("Sendmessage",(message,callback)=>
    {
        const user=getUser(socket.id)
        console.log("inside send")
        console.log(user)
        io.to(user.room).emit("message",generateMessage(user.username,message)) //io.emit will emit message to all the connections
        callback()
    })
    socket.on("sendLocation",(lati,longi,callback)=>
    {
        const user=getUser(socket.id)
        console.log("http://google.com/maps?q="+lati+","+longi)
        io.to(user.room).emit("locationMessage",generateLocationMessage(user.username,"http://google.com/maps?q="+lati+","+longi))
        callback()
    })
    socket.on("disconnect",()=>
    {
        const user=removeUser(socket.id)
        if(user)
        {
            io.to(user.room).emit("message",generateMessage('Admin',`${user.username} has left`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
        
    })
})


server.listen(3000,()=>
{
    console.log('server started')
})