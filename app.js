const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var fs = require('fs')

app.use(express.static('.'))
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.post('/sendMsg', urlencodedParser, (req, res) => {
    console.log('Message sending:', req.body);
    res.json({data: req.body});
});

app.post('/exportConv', urlencodedParser, function (req, res){
    // console.log('Conversation:', req.body);
    // let jsonFileName = __dirname + '/data/' + Date.now().toString() + '.json'
    let jsonFileName = 'export.json'
    let conversation = JSON.stringify(req.body)

    // save json to file
    fs.writeFile(jsonFileName, conversation, 'utf-8', function (err) {
        if (err) throw err;
        console.log('Saved json to ' + jsonFileName);
    })
    res.json({jsonFile: jsonFileName});
})

app.listen(3000, function (){
    console.log('visit http://localhost:3000/')
})