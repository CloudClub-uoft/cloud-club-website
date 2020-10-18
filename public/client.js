// reference to the open connection with the server
const socket = io();

//1. Update the number of users connected
//2. Send that number to every client -> 'numclients' integer>1

//Integer numusers updates the HTML at element "clientsparagraph"
function updateNumclients(numusers){
    document.getElementById('clientsparagraph').innerHTML = ""+numusers+" client"+(numusers == 1 ? "" : "s")+" currently connected."
}

//Client socket listens for an event "numclients" and takes WHATEVER DATA -> updateNumclients
socket.on('numclients', updateNumclients)
