const http =require("http")
const express=require('express')
const socketio=require('socket.io')
const app =express()
const server = http.createServer(app)
const io= socketio(server)

app.use(express.static("../public"))
app.set("view engine","hbs")
app.set("views","../views")

app.get("/",(req,res)=>
{
    res.render("index")
})
server.listen(3000,()=>
{
    console.log('server started')
})