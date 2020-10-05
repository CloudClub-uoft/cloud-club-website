const express = require('express')  //Import library
const app = express()   //Instantiate a server 'app
app.use(express.static('public'))
app.listen(3000, () => {console.log(`CloudClub Website listening at 127.0.0.1:3000`)})