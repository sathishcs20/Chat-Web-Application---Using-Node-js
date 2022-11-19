const generateMessage=(text)=>
{
    return {
        message:text,
        createdAt:new Date().getTime()
    }
}
const generateLocationMessage=(text)=>
{
    return {
        message:text,
        createdAt:new Date().getTime()
    }
}

module.exports=
{
    generateMessage,
    generateLocationMessage
}