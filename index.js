const app = require('express')();
const http = require('http').createServer(app);
const {Server} = require('socket.io');
const io = new Server(http,{
    cors:{
        origin:"*"
    }
});
const users = []
io.on('connection',(socket)=>{
    const {handshake:{query:{userId}}} = socket;
    const {id} = socket;
    const userObj = {userId,id}
    let isUserExist = users.find(f=>f.userId===userId);
    if(isUserExist){
        users.map(m=>{
            if(m.userId==userId){
                m.id= id
            }
        })
    }else{
        users.push(userObj);
    }
    console.log(users);
    console.log('Connected !')
    socket.on("message",(message)=>{
       console.log("message:",message)
       if(message){
        socket.broadcast.emit("message-broadcast",message);
       }
    })
})

http.listen(3006,()=>{
    console.log('App is running at PORT' + 3006);
});