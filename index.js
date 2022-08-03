const app = require('express')();
const http = require('http').createServer(app);
const {Server} = require('socket.io');
const io = new Server(http,{
    cors:{
        origin:"*"
    }
});
const rooms = []
io.on('connection',(socket)=>{
    socket.on('join-room',(room,user)=>{
        if(!rooms.find(f=>f.room==room)){
            let roomObj = {room,...user}
            rooms.push(roomObj)
            socket.join(room);
            console.log(`${user.clientName} has joined room ${room}`)
        }else{
            socket.join(room);
            console.log(`${user.clientName} has joined room ${room}`)
        }
        io.to(room).emit('room-joined',user);
    })

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