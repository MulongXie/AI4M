const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('.'))
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.post('/sendMsg', urlencodedParser, (req, res) => {
    console.log('Got body:', req.body);
    res.json({data: req.body});
});

app.listen(3000, function (){
    console.log('visit http://localhost:3000/')
})