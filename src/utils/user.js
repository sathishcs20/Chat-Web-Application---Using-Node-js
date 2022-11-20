const users=[]

const addUser=({id,username,room})=>
{   //clean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //validating data
    if(!username || !room)
    {
        return {
            error:'Username and room are required'
        }
    }

    //check for existing user

   const existingUser =users.find((user)=>
   {
      return user.room === room && user.username === username
   })
   if(existingUser){
    return{
        error:"username is in use"
    }
   }

   //store user
   const user = {id,username,room}
   users.push(user)
   return{user}
}

const removeUser = (id)=>
{
    const index =   users.findIndex((user)=>
    {
        return user.id === id
    })
    if(index!=-1)
    {
        return users.splice(index,1)[0] //remove elements from array using index
    }
}

const getUser=(id)=>
{
    return users.find((user)=> user.id === id)
}

const getUsersinRoom =(room)=>
{
    
    return users.filter((user)=>
    {
        user.room === room
    })
}


module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersinRoom
}