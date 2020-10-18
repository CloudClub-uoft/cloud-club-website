//HTTP SERVER
const port = 80;    //HTTP Port
const express = require('express');
const app = express();
const http = require('http').createServer(app);

app.use(express.static('public'))   //Public resources; automatic routing in this directory

//Start the server
http.listen(port, () => {
    console.log(`CloudClub Website listening on localhost:`+port)
});

const io = require('socket.io')(http);

function numClients(){
    let a = Object.keys(io.sockets.sockets).length;
    return a ? a : 1;
}

//LISTEN for when a client connects to this socket!
io.on('connection', socket => {
    //Socket is a representation of the client's connection to the server
    console.log("Client (ID: "+socket.id+") connected! ("+numClients()+" total)")
    io.emit('numclients', numClients());

    //Must be nested - the server itself can't listen for disconnects, this is the nature of Internet.
    socket.on('disconnect', () => {
        console.log("Client (ID: "+socket.id+") disconnected! ("+numClients()+" total)");
        io.emit('numclients', numClients());
    });
});