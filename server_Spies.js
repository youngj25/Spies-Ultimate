// Using express: http://expressjs.com/
var express = require('express');

// Create the app
var app = express();
// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 9000, listen);
console.log(new Date().toLocaleTimeString());

//Experiment with CPU
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
console.log("Number of CPU = " + numCPUs);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);
// Codename
var Codename = io.of('/codename'), PacSocketList=[];

Codename.on('connection', function (socket) {
	 var countDownInterval = null, CountDown = 61;	 
	 
	 // Start Timer
	 socket.on('Timer On', function(){
		 console.log("On")
		 countDownInterval = setInterval( countDown, 1000);
	 });
 
	 socket.on('Timer Off', function(){
		 console.log("Off")
		 clearInterval(countDownInterval);
		 countDownInterval = null;
		 CountDown = 61;
	 });

 
	 function countDown(){
		 CountDown --;
		 console.log(CountDown);		 
		 
		 Codename.emit('CountDown', data={ Count : CountDown});	
	 }
 
	//Disconnecting player
	socket.on('disconnect', function() {			
		 console.log("Disconnected");	
		 console.log();
	 });
 
});
