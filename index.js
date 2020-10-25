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

//Server's listening-speaking end
const serverSocket = require('socket.io')(http);

function numClients(){
    let a = Object.keys(serverSocket.sockets.sockets).length;
    return a ? a : 1;
}

//LISTEN for when a client connects to this socket!
serverSocket.on('connection', clientSocket => {
    //Socket is a representation of the client's connection to the server
    console.log("Client (ID: "+clientSocket.id+") connected! ("+numClients()+" total)")
    serverSocket.emit('numclients', numClients());

    //`serverSocket` vs `clientSocket` is IMPORTANT conceptually

    //Must be nested - the server itself can't listen for disconnects; alas, this is the nature of Internet.
    clientSocket.on('disconnect', () => {
        console.log("Client (ID: "+clientSocket.id+") disconnected! ("+numClients()+" total)");
        serverSocket.emit('numclients', numClients());
    });
});