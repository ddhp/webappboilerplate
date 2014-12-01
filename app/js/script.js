// // Create a new FULLTILT Promise for e.g. *compass*-based deviceorientation data
// var promise = new FULLTILT.getDeviceOrientation({ 'type': 'world' });
//
// // FULLTILT.DeviceOrientation instance placeholder
// var deviceOrientation;
//
// promise
//   .then(function(controller) {
//     // Store the returned FULLTILT.DeviceOrientation object
//     deviceOrientation = controller;
//     debugger
//   })
//   .catch(function(message) {
//     console.error(message);
//
//     // Optionally set up fallback controls...
//     // initManualControls();
//   });
//
// (function draw() {
//
//   // If we have a valid FULLTILT.DeviceOrientation object then use it
//   if (deviceOrientation) {
//
//     // Obtain the *screen-adjusted* normalized device rotation
//     // as Quaternion, Rotation Matrix and Euler Angles objects
//     // from our FULLTILT.DeviceOrientation object
//     var quaternion = deviceOrientation.getScreenAdjustedQuaternion();
//     var matrix = deviceOrientation.getScreenAdjustedMatrix();
//     var euler = deviceOrientation.getScreenAdjustedEuler();
//
//     // Do something with our quaternion, matrix, euler objects...
//     console.debug(quaternion);
//     console.debug(matrix);
//     console.debug(euler);
//
//   }
//
//   // Execute function on each browser animation frame
//   requestAnimationFrame(draw);
//
// })();
var count = 0;
$(document).ready(function () {
  var socket = io();
  window.addEventListener('deviceorientation', function( event ) {
    // count ++;
    // if (count > 5) {
    //   document.querySelector('body').innerHTML = '';
    //   count = 0;
    // }
    // deviceOrientationData = event;
    // var node = document.createElement("P");                 // Create a <li> node
    // var text = '';
    // for (i in event) {
    //   if (i === 'alpha' || i === 'beta' || i === 'gamma') {
    //     text += (i + ': ' + event[i] + '\n');
    //   }
    // }
    // console.log(text);

    // var textnode = document.createTextNode(text);         // Create a text node
    // node.appendChild(textnode);                              // Append the text to <li>
    // document.querySelector("body").appendChild(node);

    socket.emit('status', {beta: event.beta});
  }, false);

  socket.on('respond', function (res) {
    console.log(res);
    if (res.type === 'start') {
      document.querySelector('#status').innerHTML = 'Starts with power ' + res.power
    } else if (res.type === 'stop') {
      document.querySelector('#status').innerHTML = 'Stop'
    } else if (res.type === 'right') {
      var s = Math.abs(res.d-80);
      if (res.msg) {
        document.querySelector('#status').innerHTML = res.msg
      } else {
        document.querySelector('#status').innerHTML = s + ' degree! Right!'
      }
    } else if (res.type === 'left') {
      var s = Math.abs(res.d-80);
      if (res.msg) {
        document.querySelector('#status').innerHTML = res.msg
      } else {
        document.querySelector('#status').innerHTML = s + ' degree! Left!'
      }
    } else if (res.type === 'reset') {
      document.querySelector('#status').innerHTML = 'Reset steer!'
    } else if (res.type === 'servo') {
      // var s = Math.abs(parseInt(res.v)-80);
      // document.querySelector('#status').innerHTML = 'Now ' + s +' degree!'
    }
  });

  // start
  $('#start').click(function () {
    socket.emit('start');
  });

  // stop
  $('#stop').click(function () {
    socket.emit('stop');
  })

  // speedup
  $('#speedup').click(function () {
    defer = $.get('/speedup', function (s) {
      $('#status').text('Speed up! Speed at: ' + s);
    })
  })

  // speeddown
  $('#speeddown').click(function () {
    defer = $.get('/speeddown', function () {
      $('#status').text('Speed down! Speed at: ' + s);
    })
  })

  // // brake
  // $('#brake').click(function () {
  //   defer = $.get('/brake', function () {
  //     $('#status').text('Brake!');
  //   })
  // })

  // left
  $('#left').click(function () {
    socket.emit('left');
  })

  // right
  $('#right').click(function () {
    socket.emit('right');
  })

  // reset
  $('#reset').click(function () {
    socket.emit('reset');
  })

});
