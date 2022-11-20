const formid=document.getElementById('form')
const btnloc=document.getElementById("btnloc")
const message=document.getElementById('message')
const msgbtn=document.getElementById('msgbtn')
const msg=document.getElementById("msg")
const messageTemplate=document.getElementById("message-template").innerHTML
const locationTemplate=document.getElementById("location-template").innerHTML

const socket=io()

const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix : true})

socket.on('message',(m)=>
{
    
    const html=Mustache.render(messageTemplate,{username:m.username,message:m.message,createdAt:moment(m.createdAt).format("h:mm a")})
    msg.insertAdjacentHTML("beforeend",html)
})
socket.on('locationMessage',(m)=>
{
     
    const html=Mustache.render(locationTemplate,{username:m.username,message:m.message,createdAt:moment(m.createdAt).format("h:mm a")})
    msg.insertAdjacentHTML("beforeend",html)
})


formid.addEventListener('submit',(e)=>
{
    e.preventDefault()
    socket.emit("Sendmessage",message.value,()=>
    {
        console.log("message delivered")
        message.value=""
        message.focus()
    })
})
btnloc.addEventListener('click',(e)=> 
{
    e.preventDefault()
    if(!navigator.geolocation)
    {
        return alert("not supported")
    }
    navigator.geolocation.getCurrentPosition((position)=>
    {
        socket.emit("sendLocation",position.coords.latitude,position.coords.longitude,()=>
        {
            console.log("location sent")
            
        })
    })
})

socket.emit("join",{username,room},(error)=>
{
    if(error)
    {
        alert(error)
        location.href='/'
    }
})

