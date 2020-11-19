const express = require('express')
const app = express()
const port = 80 
const http = require('http').createServer(app);

app.use(express.static('public'))

http.listen(port, () => {
});