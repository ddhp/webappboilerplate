var express = require('express')
var app = express();
var server = require('http').createServer(app);
server.listen(7777, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})

app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.sendFile(__dirname + 'public/index.html');
});

