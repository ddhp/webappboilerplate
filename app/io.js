var express = require('express')
var app = express();
// var http = require('http').Server(app);
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// var io = require('socket.io')(http);
server.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})
var five = require("johnny-five");
var Spark = require("spark-io");
var motorR;
var motorL;
var servo;
var d = 80;

// spark core initialization
var board = new five.Board({
  io: new Spark({
    token: process.env.SPARK_TOKEN,
    deviceId: process.env.SPARK_DEVICE_ID
  })
});

board.on("ready", function() {
  servo = new five.Servo({
    pin: 'A1'
  });
  servo.to(d);
  console.log('Servo is ready!');

  motorL = new five.Motor({
    pin: 'A7'
  });

  motorR = new five.Motor({
    pin: 'A6'
  });
  console.log('Motor is ready!');

});

app.use(express.static(__dirname));
app.use(express.static(__dirname + 'app'));
app.use(express.static(__dirname + 'bower_components'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/app/index.html');
});

io.on('connection', function (socket) {
  console.log('a user log in');
  // disconnect
  socket.on('disconnect', function () {
    console.log('a user log out');
  });

  socket.on('status', function (data) {
    // limitation of phone tilt
    var beta = Math.floor(data.beta);
    if (beta > 40) {
      beta = 40
    } else if (beta < -40) {
      beta = -40
    }
    var v 
    if (Math.abs(beta) > 0) {
      v = Math.floor(80 - beta / 40 * 50);
    } else {
      v = 80;
    }
    console.log('set to ', v);
    if (servo) {
      v = servo.to(v);
      return socket.emit('respond', {type: 'servo', v: v.toString()});
    }
  });

  // start
  socket.on('start', function () {
    console.log('started!');
    power = 255;
    if (motorR) {
      motorR.start(power);
    }
    if (motorL) {
      motorL.start(power)
    }
    socket.emit('respond', {type: 'start', power: power});
  });

  // stop
  socket.on('stop', function () {
    console.log('stop!');
    if (motorR) {
      motorR.stop();
    }
    if (motorL) {
      motorL.stop()
    }
    socket.emit('respond', {type: 'stop'});
  });

  // right
  socket.on('right', function () {
    console.log('right!');
    var v;
    if (d > 80) {
      d = 80;   
    }
    d -= 10;
    if (d < 30) {
      d = 30;
      return socket.emit('respond', {type: 'right', msg: 'min 30 degree matched'});
    }
    console.log('turn right: ', d);
    if (servo) {
      v = servo.to(d);
      return socket.emit('respond', {type: 'right', d: d.toString()});
    }
  });

  // left
  socket.on('left', function () {
    console.log('left!');
    var v;
    if (d < 80) {
      d = 80;
    }
    d += 10;
    console.log('turn left: ', d);
    if (d > 130) {
      d = 130;
      return socket.emit('respond', {type: 'left', msg: 'maxium 130 degree matched'});
    }
    if (servo) {
      v = servo.to(d);
      return socket.emit('respond', {type: 'left', d: d.toString()});
    }
  });

  // reset
  socket.on('reset', function () {
    console.log('reset!');
    var v;
    d = 80;
    if (servo) {
      v = servo.to(80);
      return socket.emit('respond', {type: 'reset', d: d.toString()});
    }
  });
})

// var server = app.listen(3000, function () {
//   var host = server.address().address
//   var port = server.address().port
//   console.log('Example app listening at http://%s:%s', host, port)
// })
