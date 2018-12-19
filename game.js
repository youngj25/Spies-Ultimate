var socket, Ax = io('/ax', {forceNew:true});
var tableOfSpies = [], libraryOfImages = [], imagesOnDisplay = [], totalImages = 0;
var animeImages = [], cartoonImages = [], gameImages = [], additionalImages = [];
var spriteRatioWidthtoHeight =1, spriteRatioHeighttoWidth=1;
var Width, Height, Game_State = "Start";
var startGame, steps = 0, objects = [];
var leftScores = 0, rightScores = 0, ScoreBoard = [], saveLeftScoreTexture = null, saveRightScoreTexture = null;
var saveCardWhiteTexture = null, saveCardBlackTexture = null;

function init() {
	 // create a scene, that will hold all our elements such as objects, cameras and lights.
	 var scene = new THREE.Scene();				
	
	 // create a camera, which defines where we're looking at.
	 camera = new THREE.PerspectiveCamera(50, 500/ 500, 0.1, 1000);
	 camera.position.set(0,0,53);
	 scene.add(camera);
	 //scene.background = new THREE.Color( 0x1a0a3a );
	 scene.background = new THREE.Color( 0x000000 );
	 // create a render and set the size
	 var renderer = new THREE.WebGLRenderer({ antialias: true} );
	 renderer.setClearColor(new THREE.Color(0x000000, 0.0));
	 Width = window.innerWidth*0.95;
	 Height = window.innerHeight*1.025;
 	 renderer.setSize(Width, Height);
	 //camera.aspect = window.innerWidth/window.innerHeight;
	 camera.aspect = Width/Height;
	 
	 socket = io.connect('http://localhost:9000');
        
	 //Insert Data from the Server
	 Ax.on('Get Data', function(data){
		 
		 
		 
	 });
	 
	 //add the output of the renderer to the html element
	 document.getElementById("WebGL-output").appendChild(renderer.domElement);
	 
	 //Keyboard Functions
	 function onKeyDown(event) {
		 if (event.keyCode == 32 && Game_State == "Start") // Spacebar
			 go_to_Game_Board();
		 else if(event.keyCode == 32 && Game_State != "Start"){
			 //Clear the Scene
			 while(imagesOnDisplay.length >=1){
				 scene.remove(imagesOnDisplay[0]);
				 imagesOnDisplay.shift();
			 }
			 
			 //Clear the clickable/draggable objects
			 while(objects.length >=1){
				 objects.shift();
			 }
			 
			 //Clear the Score Board
			 while(ScoreBoard.length >=1){
				 scene.remove(ScoreBoard[0]);
				 ScoreBoard.shift();
			 }
			 
			 libraryOfImages = [];
			 scene.add(startGame);
			 Game_State = "Start";
			 
		 }
	 }; 
	 document.addEventListener('keydown', onKeyDown, false);
	 
	 //add spotlight for the shadows
	 var spotLight = new THREE.SpotLight(0xffffff);
	 spotLight.position.set(0, 0, 25);
	 spotLight.castShadow = false;
	 spotLight.intensity =2;
	 scene.add(spotLight);			
	
	 renderScene();
	 drag_objects();	 
	 load_Text_and_Buttons();
	 load_Start_Screen();
	 load_Anime_Images();
	 load_Cartoon_Images();
	 load_Game_Images();
	 load_Additional_Images();		 
	
	 //Render the Scenes
	 function renderScene(){
		 try{
			 steps++;
			 //Render steps
			 //render using requestAnimationFrame
			 requestAnimationFrame(renderScene);
			 renderer.render(scene, camera);
			 scene.traverse(function (e) {
				 if(e.name == "leftSiding" && steps % 25 == 0 && Game_State != "Start"){
					 if(e.style == 1){
						 
					 }
					 else if(e.style == 2){
						 
					 }
					 else if(e.style == 3){
						 
					 }
				 }
				 else if(e.name == "rightSiding" && steps % 25 == 0 && Game_State != "Start"){
					 if(e.style == 1){
						 e.material.color  = new THREE.Color("rgb(160,53,53)");
						 e.style = 2;
					 }
					 else if(e.style == 2){
						 e.material.color  = new THREE.Color("rgb(190,53,53)");
						 e.style = 3;
					 }
					 else if(e.style == 3){
						 e.material.color  = new THREE.Color("rgb(220,53,53)");
						 e.style = 1;
					 }
				 }
			 });
		 }catch(e){}
	 }
	 
	 //Make Objects Draggable - Additionally used as buttons
	 function drag_objects(){
		 var dragControls  = new THREE.DragControls( objects, camera, renderer.domElement );
				
			 dragControls.addEventListener( 'dragstart', function(event) {
																			 if (event.object.name == "startButton"){
																				 PacMania.emit('Player has joined',gameSettingsOptions[0]);
																				 remove_Game_Settings_Screen();
																				 removeButton(raButton);
																				 controllerDirection = "";
																				 scene.remove(occuranceBar);		 
																				 scene.remove( occuranceCircle );
																				 if(scene.getObjectByName('SectionHighlight') != null)
																					 scene.remove(SectionHighlight);
																			 }
																			 else if (event.object.name == "cardHolder"){
																				 console.log("cardHolder");
																				 if(Math.floor(Math.random()*2)==0){ // Blue
																					 event.object.material.color  = new THREE.Color("rgb(23,155,220)");
																					 
																					 ScoreBoard[leftScores].material.color  = new THREE.Color("rgb(23,155,220)");
																					 leftScores ++;						
																				 }
																				 else{ // Red
																					 event.object.material.color  = new THREE.Color("rgb(220,53,53)");
																					 
																					 ScoreBoard[ScoreBoard.length - rightScores-1].material.color  = new THREE.Color("rgb(220,53,53)");
																					 rightScores ++;
																				 }
																			 }
																			 
																			 //else console.log(event.object);
																			 //console.log("lol start of drag: ");
																		 });
																		 
			 dragControls.addEventListener( 'drag', function(event)   {
																			 if(event.object.name == "startButton")
																				 startButton.position.set(startButton.posX, startButton.posY, startButton.posZ);
																			 else if (event.object.name == "cardHolder")
																				 event.object.position.set(event.object.posX, event.object.posY, event.object.posZ);
																		 });
																		
			 dragControls.addEventListener( 'dragend', function(event)   {
																			 if (event.object.name == "occuranceCircle"){
																				 //console.log(event.object.position.x);
																				 event.object.position.y = event.object.posY; 
																				 gameSettingsOptions[0].fruitOccurance = (16 + event.object.position.x) * 2.5 + 10;
																			 }
				 
				 
			 });
																		 
			 //console.log(dragControls);
			 //https://www.learnthreejs.com/drag-drop-dragcontrols-mouse/
	 }
	  
	 //Load the Start Screens
	 function load_Start_Screen(){
		 scene.add(startGame);
		 Game_State = "Start";		
		 steps = 0;		 
	 }
	 
	 //Go to the Game Board
	 function go_to_Game_Board(){
		 scene.remove(startGame);
		 Game_State = "Game";
		 leftScores = 0, rightScores = 0;
		 fillLibraryOfImages();
	 }
	  
	 //Load Anime Images
	 function load_Anime_Images(){
		 //Loading Anime Images from the File
		 animeImages=[];
		 
		  jQuery.get("Images/Anime/Anime.txt", undefined, function(data) {
			 //Prints the full data
			 //console.log(data);
			 var dataLength = data.split("\n").length;
			 
			 //Printing out the info
			 for(var x = 8; x < dataLength-4; x+=6){
				 //console.log("Series: "+data.split("\n")[x]);
				 //console.log("Character Name: "+data.split("\n")[x+1]);
				 //console.log("Filename: "+data.split("\n")[x+2]);
				 //console.log("Background Color: "+data.split("\n")[x+3]);
				 //console.log("Image Source: "+data.split("\n")[x+4]);
				 //console.log(" ");
				 
				 var anime = {
					 series : data.split("\n")[x],
					 name : data.split("\n")[x+1],
					 filename: data.split("\n")[x+2],
					 backgroundColor: data.split("\n")[x+3],
					 sprite: null,
					 source: data.split("\n")[x+4]
				 }
				 
				 animeImages.push(anime);
				 
			 }
			 
			 }, "html").done(function() {
				 //console.log("second success");
			 }).fail(function(jqXHR, textStatus) {
				 console.log("failed");
			 }).always(function() {
				 console.log("Anime Loaded - "+animeImages.length+" images");
				 
		 });
		 
	 }
	 
	 //Load Cartoon Images
	 function load_Cartoon_Images(){
		 //Loading Cartoon Images from the File
		 cartoonImages=[];
		 
		 jQuery.get("Images/Cartoon/Cartoon.txt", undefined, function(data) {
			 //Prints the full data
			 //console.log(data);
			 var dataLength = data.split("\n").length;
			 
			 //Printing out the info
			 for(var x = 8; x < dataLength-4; x+=6){				 
				 var cartoon = {
					 series : data.split("\n")[x],
					 name : data.split("\n")[x+1],
					 filename: data.split("\n")[x+2],
					 backgroundColor: data.split("\n")[x+3],
					 sprite: null,
					 source: data.split("\n")[x+4]
				 }
				 cartoonImages.push(cartoon);
			 }
			 
			 }, "html").done(function() {
				 //console.log("second success");
			 }).fail(function(jqXHR, textStatus) {
				 console.log("failed");
			 }).always(function() {
				 console.log("Cartoon Loaded - "+cartoonImages.length+" images");
		 });
	 }
	
	 //Load Game Images
	 function load_Game_Images(){
		 //Loading Game Images from the File
		 gameImages=[];
		 
		 jQuery.get("Images/Game/Game.txt", undefined, function(data) {
			 //Prints the full data
			 //console.log(data);
			 var dataLength = data.split("\n").length;
			 
			 //Printing out the info
			 for(var x = 8; x < dataLength-4; x+=6){				 
				 var game = {
					 series : data.split("\n")[x],
					 name : data.split("\n")[x+1],
					 filename: data.split("\n")[x+2],
					 backgroundColor: data.split("\n")[x+3],
					 sprite: null,
					 source: data.split("\n")[x+4]
				 }
				 gameImages.push(game);
			 }
			 
			 }, "html").done(function() {
				 //console.log("second success");
			 }).fail(function(jqXHR, textStatus) {
				 console.log("failed");
			 }).always(function() {
				 console.log("Games Loaded - "+gameImages.length+" images");
		 });	 
	 }
	 
	 //Load Additional Images
	 function load_Additional_Images(){
		 //Loading Additional Images from the File
		 additionalImages=[];
		 
		  var loader = new THREE.TextureLoader();
		 loader.crossOrigin = true;
		 //Left Siding
		 var Texture = loader.load( 'Images/Additional Images/leftSide.png');
		 Texture.minFilter = THREE.LinearFilter;
		 var Imagecover =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Imagecover.x = 0;
		 Imagecover.y = 0;
		 additionalImages.push(Imagecover);
		 //Right Siding
		 Texture = loader.load( 'Images/Additional Images/rightSide.png');
		 Texture.minFilter = THREE.LinearFilter;
		 Imagecover =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Imagecover.x = 0;
		 Imagecover.y = 0;
		 additionalImages.push(Imagecover);
	 }
		 
	 //Loads all of the images and place them into the libraryOfImages
	 function load_All_Images(){
		 //First Clear the libraryOfImages
		 libraryOfImages=[];
		 
		 load_Anime_Images();
		 //load_Cartoon_Images();
		 //load_Game_Images();
		 //load_Additional_Images();
		 
		 /**
		 //Anime
		 for(var x = 0; x < animeImages.length; x++)
			 libraryOfImages.push(animeImages[x]);
		 
		 //Cartoon
		 for(var x = 0; x < cartoonImages.length; x++)
			 libraryOfImages.push(cartoonImages[x]);
		 
		 //Game
		 for(var x = 0; x < gameImages.length; x++)
			 libraryOfImages.push(gameImages[x]);
		 **/
		 
		 //totalImages = animeImages.length + cartoonImages.length + gameImages.length;
		 //console.log("Total Images = "+ totalImages);
		 //displayPlaceHolders();
	 }
	  
	 //Load and a preset the images for use
	 function loadImages(pictureName, characterName, type, cardBackgroundColor, source){
		 //Sprites
		 var loader = new THREE.TextureLoader();
		 loader.crossOrigin = true;
		 var Texture = loader.load( 'Images/'+type+'/'+pictureName);
		 Texture.minFilter = THREE.LinearFilter;
		 var Imagecover =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Imagecover.mediaType = type;
		 Imagecover.source = source;
		 Imagecover.revealed = false;
		 Imagecover.team = null;		 
		 Imagecover.characterName = characterName;		 
		 console.log(Imagecover.characterName );
		 Imagecover.cardBackgroundColor = cardBackgroundColor;		 
		 Imagecover.x = 0;
		 Imagecover.y = 0;
		 return Imagecover;
	 }
	 
	 //Load and a preset the images for use
	 function loadImagesfromText(pictureName, type, cardBackgroundColor){
		 //Sprites
		 var loader = new THREE.TextureLoader();
		 loader.crossOrigin = true;
		 var Texture = loader.load( 'Images/'+type+'/'+pictureName);
		 Texture.minFilter = THREE.LinearFilter;
		 var Imagecover =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Imagecover.revealed = false;
		 Imagecover.team = null;
		 Imagecover.cardBackgroundColor = cardBackgroundColor;		 
		 Imagecover.x = 0;
		 Imagecover.y = 0;
		 return Imagecover;
	 }
	 
	 //
	 function fillLibraryOfImages(){

		 
		 // I have an additional section size here because at times a player may not want a section...
		 // in other words, setting it to zero
		 animeSize = animeImages.length;
		 cartoonSize = cartoonImages.length;
		 gameSize = gameImages.length;
		 
		 //First get a tally of all applicable Images
		 var totalImages = animeSize + cartoonSize + gameSize;
		 
		 var listOfRandomImages = [];
		 
		 if(totalImages >= 23){
			 if(totalImages > 23){
				 //Randomly Select Characters
				 while(listOfRandomImages.length <= 23){
					 var arrayNumber = Math.floor(Math.random()*totalImages);
					 
					 var uniqueNumber = true;
					 
					 for(var x=0; x<listOfRandomImages.length && uniqueNumber != false; x++){
						 if( listOfRandomImages[x] == arrayNumber)
							 uniqueNumber = false;
					 }
					 //console.log("Results: "+uniqueNumber+" arrayNumber = "+arrayNumber);
					 if(uniqueNumber == true){
						 //console.log("Results: "+uniqueNumber+" arrayNumber = "+arrayNumber);
						 listOfRandomImages.push(arrayNumber);
					 }
				 }				 
				 //Load the Images from various sections
				 while(listOfRandomImages.length >= 1){
					 //First Check if it under anime and if it is add the anime
					 if(listOfRandomImages[0]  < animeSize){
						 var x = listOfRandomImages[0];
						 
						 if(animeImages[x].sprite == null){						 
							 animeImages[x].sprite = loadImagesfromText(animeImages[x].filename,"Anime",animeImages[x].backgroundColor);
							 animeImages[x].sprite.characterName = animeImages[x].name;
							 animeImages[x].sprite.backgroundColor = animeImages[x].backgroundColor;
						 }
						 libraryOfImages.push(animeImages[x].sprite);			
						 listOfRandomImages.shift();
					 }
					 //Second Check if it under Cartoon and if it is add the Cartoon
					 else if((listOfRandomImages[0]-animeSize)  < cartoonSize){
						 var x = listOfRandomImages[0]-animeSize;
						 if(cartoonImages[x].sprite == null){			
							 cartoonImages[x].sprite = loadImagesfromText(cartoonImages[x].filename,"Cartoon",cartoonImages[x].backgroundColor);
							 cartoonImages[x].sprite.characterName = cartoonImages[x].name;
							 cartoonImages[x].sprite.backgroundColor = cartoonImages[x].backgroundColor;
						 }
						 libraryOfImages.push(cartoonImages[x].sprite);		
						 listOfRandomImages.shift();						 
					 }
					 //Thirdly Check if it under game and if it is add the game
					 else if((listOfRandomImages[0]-animeSize-cartoonSize)  < gameSize){
						 var x = listOfRandomImages[0]-animeSize-cartoonSize;
						 if(gameImages[x].sprite == null){			
							 gameImages[x].sprite = loadImagesfromText(gameImages[x].filename,"Game",gameImages[x].backgroundColor);
							 gameImages[x].sprite.characterName = gameImages[x].name;
							 gameImages[x].sprite.backgroundColor = gameImages[x].backgroundColor;
						 }
						 libraryOfImages.push(gameImages[x].sprite);		
						 listOfRandomImages.shift();						 
					 }
				 }
			 }
			 else{
				 //Upload everything
			 }
			 
			 displayPlaceHolders();
		 }
		 else{			 
			 console.log("Not enough images.... sorry");
		 }
		
		
	 }
	  
	 //
	 function displayPlaceHolders(){
		 var initialHeight = 11.75;
		 for(var x = 0; x<libraryOfImages.length && x < 24; x++){
			 //Set the Image
			 var tempScene = new THREE.Sprite();	
			 tempScene.material = libraryOfImages[x];
			 tempScene.position.set((x%6)*8-20,-10*Math.floor(x/6)+initialHeight,-2); //xyz
			 tempScene.scale.set(6,8,1);
			 imagesOnDisplay.push(tempScene);
			 scene.add(imagesOnDisplay[imagesOnDisplay.length-1]);
			 
			 //Add the Card
			 var cardHolder = new THREE.Sprite();				 
			 //Set the Card Background Color
			 //Make the Card Background Black
			 if(tempScene.material.backgroundColor.trim() == "Black")				 
				 cardHolder.material = create_Black_Card();
			 //Make the Card Background White
			 else if(tempScene.material.backgroundColor.trim()  == "White") 
				 cardHolder.material = create_White_Card();
			 cardHolder.posX =(x%6)*8-20;	 
			 cardHolder.posY = -10*Math.floor(x/6)+initialHeight-1;	 
			 cardHolder.posZ = -2.1;	 
			 cardHolder.position.set(cardHolder.posX, cardHolder.posY, cardHolder.posZ); //xyz
			 cardHolder.scale.set(7,9,1);
			 cardHolder.name = "cardHolder";
			 imagesOnDisplay.push(cardHolder);
			 scene.add(imagesOnDisplay[imagesOnDisplay.length-1]);
			 objects.push(imagesOnDisplay[imagesOnDisplay.length-1]);
			 //Add the Character's Name
			 //console.log(libraryOfImages[x].characterName);
			 var text = text_creation(libraryOfImages[x].characterName,0,2,0.75);
			 
			 text.parameters.font= "115px Arial";
			 //text.parameters.font= "70px Arial";
			 text.parameters.fillStyle= "Yellow";
			 text.position.set((x%6)*8-20,-9.97*Math.floor(x/6)+initialHeight-4.58, -1.9);
			 text.scale.set(6,1.25,1);
			 text.update();
			 imagesOnDisplay.push(text);
			 scene.add(imagesOnDisplay[imagesOnDisplay.length-1]);
		 }
		 
		 //Left Siding
		 var leftSiding = new THREE.Sprite();				 
		 leftSiding.material = additionalImages[0];
		 leftSiding.material.color  = new THREE.Color("rgb(23,155,220)");
		 leftSiding.position.set(-16.25,-16.5,-2.5); //xyz
		 leftSiding.scale.set(20,20,1);
		 leftSiding.name = "leftSiding";
		 leftSiding.style = 1;		 
		 imagesOnDisplay.push(leftSiding);
		 scene.add(imagesOnDisplay[imagesOnDisplay.length-1]);
		 
		 //Right Siding
		 var rightSiding = new THREE.Sprite();				 
		 rightSiding.material = additionalImages[1];
		 rightSiding.material.color  = new THREE.Color("rgb(220,53,53)");
		 rightSiding.position.set(16.25,-16.5,-2.5); //xyz
		 rightSiding.scale.set(20,20,1);
		 rightSiding.name = "rightSiding";
		 rightSiding.style = 1;		 
		 imagesOnDisplay.push(rightSiding);
		 scene.add(imagesOnDisplay[imagesOnDisplay.length-1]);
		 
		 //Sides Scoring
		 for(var x = 0; x < 8; x++){
			 var score = create_Left_Score();
			 score.material.color  = new THREE.Color("rgb(255,255,255)");
			 score.position.set(-22.5+x*2.75,18.75,-2); //xyz
			 score.scale.set(1.75, 3.5,1);
			 score.name = "Left Score "+x;
			 ScoreBoard.push(score);
			 scene.add(ScoreBoard[ScoreBoard.length-1]);			 
		 }
		 //Sides Scoring
		 for(var x = 0; x < 8; x++){
			 var score = create_Right_Score();
			 score.material.color  = new THREE.Color("rgb(255,255,255)");
			 score.position.set(22.5-x*2.75,18.75,-2); //xyz
			 score.scale.set(1.75, 3.5,1);
			 score.name = "Right Score "+(7-x);
			 score.style = 1;		 
			 ScoreBoard.push(score);
			 scene.add(ScoreBoard[ScoreBoard.length-1]);			 
		 }
		 
		 
		 //Start the steps
		 steps = 0;
	 }
	 
	 //
	 function load_Text_and_Buttons(){
		 startGame = text_creation( "Start Game", 0, 3, 0.8);
		 startGame.parameters.font= "135px Arial";
		 startGame.parameters.fillStyle= "White";
		 startGame.position.set(0,-8, -1.9);
		 startGame.scale.set(14,3,1);
		 startGame.name = " Start Game";
		 startGame.update();
		 
	 }
	 
	 //Setting the cards 
	 function divide_cards_into_teams(){
		 //Help from http://www.color-blindness.com/coblis-color-blindness-simulator/
		 // "Blue" - Team Aqua
		 // "Red" - Team Magma
		 // "Dark Grey" - Civilian 
		 // "Assassin" - 
		 var cardsArray= ["Blue","Red","Dark Grey","Assassin" ];
		 console.log("Cards Array Lengt : "+cardsArray.length);
		 //cardsArray.push
		 
	 }
	 
	 //Generate Unique card with a White Background
	 function create_White_Card(){
		 //card;
		 if(saveCardWhiteTexture == null){
			 var loader = new THREE.TextureLoader();
			 loader.crossOrigin = true;
			 saveCardWhiteTexture = loader.load( 'Images/Additional Images/whiteBackground.png' );
			 saveCardWhiteTexture.minFilter = THREE.LinearFilter;
		 }
		 var Cards = new THREE.SpriteMaterial( { map: saveCardWhiteTexture, color: 0xffffff } );
		 return Cards;
	 }
	 
	 //Generate Unique card with a Black Background
	 function create_Black_Card(){
		 //card;
		 if(saveCardBlackTexture == null){
			 var loader = new THREE.TextureLoader();
			 loader.crossOrigin = true;
			 saveCardBlackTexture = loader.load( 'Images/Additional Images/blackBackground.png' );
			 saveCardBlackTexture.minFilter = THREE.LinearFilter;
		 }
		 var Cards = new THREE.SpriteMaterial( { map: saveCardBlackTexture, color: 0xffffff } );
		 return Cards;
	 }
	  
	 //Left Score Creation
	 function create_Left_Score(){
		 //Score
		 if(saveLeftScoreTexture == null){
			 var loader = new THREE.TextureLoader();
			 loader.crossOrigin = true;
			 saveLeftScoreTexture = loader.load( 'Images/Additional Images/leftScores.png' );
			 saveLeftScoreTexture.minFilter = THREE.LinearFilter;
		 }
		 var Score = new THREE.SpriteMaterial( { map: saveLeftScoreTexture, color: 0xffffff } );
		 return Score;
	 }
	 
	 //Right Score Creation
	 function create_Right_Score(){
		 //Score
		 if(saveRightScoreTexture == null){
			 var loader = new THREE.TextureLoader();
			 loader.crossOrigin = true;
			 saveRightScoreTexture = loader.load( 'Images/Additional Images/rightScores.png' );
			 saveRightScoreTexture.minFilter = THREE.LinearFilter;
		 }
		 var Score = new THREE.SpriteMaterial( { map: saveRightScoreTexture, color: 0xffffff } );
		 return Score;
	 }
	  
	 //Text Creation Function
	 //Since this is used more than 10 times throughout the code
	 //I created this function to cut down on the length and effort
	 function text_creation(textValue, heightPower, widthPower, lineHeight ){		 
		 var texts = new THREEx.DynamicText2DObject();
		 texts.parameters.text = textValue;
		 
		 //HeightPower
		 //The HeightPower works in the power of two and starts with 2^7 = 128
		 //The height for the canvas works like this  = 2^(7+heightPower); 
		 texts.dynamicTexture.canvas.height = Math.pow(2, 7+heightPower);	
		  
		 //WidthPower
		 //The WidthPower works in the power of two and starts with 2^7 = 128
		 //The width for the canvas works like this  = 2^(7+widthPower); 
		 texts.dynamicTexture.canvas.width = Math.pow(2, 7+widthPower);	
		 
		 /** Powers of 2
				 2^(7) = 128
				 2^(8) = 256
				 2^(9) = 512
				 2^(10) = 1024
				 2^(11) = 2048
				 2^(12) = 4096
		 **/
		 
		 //Line Height
		 //The higher the value the higher gap
		 texts.parameters.lineHeight= lineHeight;
		 
		 texts.parameters.align = "center";
		 
		 texts.update();
		 return texts;
	 }
	 
	 
}
window.onload = init;	