const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var fs = require('fs')
var path = require('path')

app.use(express.static('.'))
app.use(express.static(__dirname))
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/data'))
app.use(express.static(__dirname + '/data/conversation'))
app.use(express.static(__dirname + '/data/conversation/enquirer'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.post('/sendMsg', urlencodedParser, (req, res) => {
    console.log('Message sending:', req.body);
    res.json({data: req.body});
});

app.post('/saveConv', urlencodedParser, function (req, res){
    // let jsonFileName = __dirname + '/data/' + Date.now().toString() + '.json'
    let jsonFileName = path.join(__dirname, '/data/conversations', req.body.user.toLowerCase(), req.body.id + '.json')
    let conversation = JSON.stringify(req.body, null, 2)
    // save json to file
    fs.writeFile(jsonFileName, conversation, 'utf-8', function (err) {
        if (err) console.log(err)
        else{
            console.log('Saved json to ' + jsonFileName)
            res.json({jsonFile: jsonFileName})
        }
    })
})

app.post('/readConv', urlencodedParser, function (req, res){
    let jsonFileName = path.join(__dirname, '/data/conversations', req.body.user.toLowerCase(), req.body.id + '.json')
    fs.readFile(jsonFileName, 'utf-8',function (err, data){
        if (err) console.log(err)
        else {
            console.log('Read json from ' + jsonFileName);
            res.json(JSON.parse(data))
        }
    })
})

app.listen(3333, function (){
    console.log('visit http://localhost:3333/')
})
