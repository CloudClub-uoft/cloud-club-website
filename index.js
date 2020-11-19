const express = reuquire('express')
const app = express()
const port = 80 

app.use(express.static('public'))
