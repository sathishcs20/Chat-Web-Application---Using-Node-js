const http =require("http")
const express=require('express')
const socketio=require('socket.io')
const app =express()
const server = http.createServer(app)
const io= socketio(server)
const {generateMessage,generateLocationMessage}=require("./utils/generateMsg")
app.use(express.static("../public"))


app.get("/",(req,res)=>
{
    res.render("index")
})
io.on("connection",(socket)=>
{
    socket.broadcast.emit("message",generateMessage("New user joined")) //broadcast.emit will emit the message to all the connections except the one joined
    socket.on("Sendmessage",(message,callback)=>
    {
        io.emit("message",generateMessage(message)) //io.emit will emit message to all the connections
        callback()
    })
    socket.on("sendLocation",(lati,longi,callback)=>
    {
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