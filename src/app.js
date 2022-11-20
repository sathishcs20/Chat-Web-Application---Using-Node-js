const http =require("http")
const express=require('express')
const socketio=require('socket.io')
const app =express()
const server = http.createServer(app)
const io= socketio(server)
const {generateMessage,generateLocationMessage}=require("./utils/generateMsg")
app.use(express.static("../public"))



io.on("connection",(socket)=>
{
    // socket.broadcast.emit("message",generateMessage("New user joined")) //broadcast.emit will emit the message to all the connections except the one joined

    socket.on("join",({username,room})=>
    {
        socket.join(room)
        socket.broadcast.to(room).emit("message",generateMessage(username+" joined")) 

        //io.emit           socket.broadcast.emit
        //io.to().smit      socket.broadcast.to().smit  these two will emit messages to a particular room
    })
    socket.on("Sendmessage",(message,callback)=>
    {
        io.emit("message",generateMessage(message)) //io.emit will emit message to all the connections
        callback()
    })
    socket.on("sendLocation",(lati,longi,callback)=>
    {
        console.log("http://google.com/maps?q="+lati+","+longi)
        io.emit("locationMessage",generateLocationMessage("http://google.com/maps?q="+lati+","+longi))
        callback()
    })
    socket.on("disconnect",()=>
    {
        io.emit("message",generateMessage("user left"))
    })
})


server.listen(3000,()=>
{
    console.log('server started')
})