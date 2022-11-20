const formid=document.getElementById('form')
const btnloc=document.getElementById("btnloc")
const message=document.getElementById('message')
const msgbtn=document.getElementById('msgbtn')
const $messages=document.getElementById("msg")
const messageTemplate=document.getElementById("message-template").innerHTML
const locationTemplate=document.getElementById("location-template").innerHTML
const sidebarTemplate =document.getElementById("sidebar-template").innerHTML
const socket=io()

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild;
    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
    // Visible height
    const visibleHeight = $messages.offsetHeight
    // Height of messages container
    const containerHeight = $messages.scrollHeight;
    // How far have the user scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }

};
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix : true})

socket.on('roomData',({room,users})=>
{
    const html=Mustache.render(sidebarTemplate,{room,users})
    document.querySelector('#sidebar').innerHTML=html
})
socket.on('message',(m)=>
{
    
    const html=Mustache.render(messageTemplate,{username:m.username,message:m.message,createdAt:moment(m.createdAt).format("h:mm a")})
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
})
socket.on('locationMessage',(m)=>
{
     
    const html=Mustache.render(locationTemplate,{username:m.username,message:m.message,createdAt:moment(m.createdAt).format("h:mm a")})
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
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

