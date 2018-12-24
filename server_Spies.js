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
var Codename = io.of('/codename'), cardsArray = [];

Codename.on('connection', function (socket) {
	 var countDownInterval = null, CountDown = 60;	
	 var gameSettings= [], gameState = "Idle";
	 
	 // Start Timer
	 socket.on('Timer On', function(){
		 console.log("Timer On")
		 countDownInterval = setInterval( countDown, 1000);
	 });
	 
	 // Stop Timer and Reset Timer
	 socket.on('Timer Off', function(){
		 console.log("Timer Off")
		 clearInterval(countDownInterval);
		 countDownInterval = null;
		 CountDown = 60;
	 });	 
	 
	 // A user has started a Game
	 socket.on('Start Game', function(data){
		 if(gameState == "Idle"){
			// gameState = "Active";
			 
			 // For a size of 24 Cards
			 // 1 - Assassin
			 // 8 - Team 1 Members
			 // 8 - Team 2 Members
			 // 1 - First Team's turn gets an extra member
			 // 6 - Random Civilians - have a null value
			 
			 // Set Cards Array
			 cardsArray = data.cards;
			 
			 
			 // Sets the Assassin card randomly
			 cardsArray[Math.floor(Math.random()*cardsArray.length)].type = "Assassin";
				 
			 // Team 1 Members
			 var members = 0;
			 while(members < 9){ // make it 9 for temp but it's really 8
				 var rand = Math.floor(Math.random()*cardsArray.length);
				 if(cardsArray[rand].type == null){
					 cardsArray[rand].type = 'Team 1';
					 members++;
				 }				 
			 }
				 
			 //Team 2 Members
			 members = 0;
			 while(members < 8){ 
				 var rand = Math.floor(Math.random()*cardsArray.length);
				 if(cardsArray[rand].type == null){
					 cardsArray[rand].type = 'Team 2';
					 members++;
				 }				 
			 }			 			 
				 
			 // Broadcast the Info
			 Codename.emit('Board', data={ Board : cardsArray});
		 }
	 });
	 
	 
	 // Get Board Info
	 socket.on('Get Board Info', function(){
		 console.log("....");
		 
		 if(cardsArray == null)
			 console.log("Nope");
		 else if(cardsArray == undefined)
			 console.log("Nope Nope");
		 else {
			 Codename.emit('Info', data={ Board : cardsArray});			
			 //console.log(cardsArray);
		 }
		 
	 });
 
	 function countDown(){
		 CountDown --;
		 
		 Codename.emit('CountDown', data={ Count : CountDown});			 
		 
		 //Reset the CountDown for the next turn
		 if(CountDown == 0 ){
			 // The Extra +5 is for players to have time to start the next round/turn
			 // A Transition period
			 CountDown = 60 + 10;			 
		 }
		 
		 
	 }
 
	 //Disconnecting player
	 socket.on('disconnect', function() {			
		 console.log("Disconnected");	
		 console.log();
	 });
 
});



