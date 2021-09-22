
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var monster;
var coinScore = 0;
var treScore = 0;
//var sword = 1;
//var monKills = 0;

var START = 0;
var PLAY = 1;
var END = 2;
var WIN = 3;
var gameState = START;
var lifeScore = 3;


function preload(){
	path_img = loadImage("assets/path.jpg");
	boy_ani = loadAnimation("assets/boy1.PNG", "assets/boy2.PNG", "assets/boy3.PNG", "assets/boy4.PNG");
	gold1_img = loadImage("assets/goldcoins.png");
	gold2_img = loadImage("assets/treasure.png");
	sword_img = loadImage("assets/sword.png");
	monster1_img = loadImage("assets/monster1.png");	
	monster2_img = loadImage("assets/monster2.png");
	monster3_img = loadImage("assets/monster3.png");
	//monKilledImg = loadImage("assets/monKilled.png");
	//scoreCoinImg = loadImage("assets/scoreCoin.png");
	gameOverImg = loadImage("assets/gameover.png");
	startImg = loadImage("assets/start.JPG");
	startbtnImg = loadImage("assets/startbtn.JPG");
	winImg = loadImage("assets/win.JPG");
	fullLife = loadAnimation("assets/3Lives.png");
	two_lives = loadAnimation("assets/2Lives.png");
	one_life = loadAnimation("assets/oneLife.png");
	noLife = loadAnimation("assets/noLife.png");
	bg_music = loadSound("assets/bg_music.m4a");
	clickSound = loadSound("assets/click.wav");
	endSound = loadSound("assets/end.wav");
	alertSound = loadSound("assets/alert.mp3");
	chimeSound = loadSound("assets/chime.wav");
}

function setup() {
	createCanvas(windowWidth-23, windowHeight-5);

	bg_music.play();
	bg_music.setVolume(2);

	engine = Engine.create();
	world = engine.world;

	//Create the Bodies Here.
	
	path = createSprite(100,height/2-15,10,10);
	path.addImage(path_img);
	path.scale = 4.5;
	path.velocityX = -15;
	path.visible = false;

	boy = createSprite(250, 200, 10, 10);
	boy.addAnimation("running", boy_ani);
	boy.scale = 0.5;
	boy.visible = false;
	Engine.run(engine);

	/*block1 = createSprite(0, 0, width*2, 50);
	block2 = createSprite(0, height, width*2, 50);
	block2.shapeColor = "blue";
	block1.shapeColor = "blue";*/

	scoreCoin = createSprite(width-150, 80, 10, 10);
	scoreCoin.addImage("coin", gold1_img);
	scoreCoin.scale = 0.25;
	scoreCoin.visible = false;

	scoreTre = createSprite(width-350, 90, 10, 10);
	scoreTre.addImage("coin", gold2_img);
	scoreTre.scale = 0.18;
	scoreTre.visible = false;

	life = createSprite(130, 80, 10, 10);
	life.addAnimation("life", fullLife);
	life.addAnimation("2life", two_lives);
	life.addAnimation("1life", one_life);
	life.addAnimation("noLife", noLife);
	life.changeAnimation("life");
	life.scale = 0.32;
	life.visible = false;

	/*scoreSword = createSprite(width-600, 60, 10, 10);
	scoreSword.addImage("sword", sword_img);
	scoreSword.scale = 0.5;*/

	/*monKilled = createSprite(width-800, 60, 10, 10);
	monKilled.addImage("monster", monKilledImg);
	monKilled.scale = 0.3;*/

	swordGrp = new Group();
	mon1Grp = new Group();
	mon2Grp = new Group();
	mon3Grp = new Group();
	gold1Grp = new Group();
	gold2Grp = new Group();

	startbtn = createSprite(width-200, height-70, 10, 10);
	startbtn.addImage("start", startbtnImg);

	//boy.debug = true;
	boy.setCollider("rectangle", 0, 0, 100, 370);
  
}


function draw() {
  rectMode(CENTER);
  background(0);
  //image(path_img, 0, 0, width*3, height);

  if (gameState === START){
	  background(255);
	image(startImg, 0,0,width,height);
		if(mousePressedOver(startbtn)){
			clickSound.play();
			clickSound.setVolume(0.5);
			gameState = PLAY;
		}
	}
  
  
  if(gameState===PLAY){
	  boy.visible = true;
	  path.visible = true;
	  startbtn.visible = false;
	  scoreTre.visible = true;
	  scoreCoin.visible = true;
	  life.visible = true;
  if(path.x<0){
	  path.x = 1000;
  }

  if(coinScore >= 15 && treScore >= 10){
	gameState = WIN;
  }

  moveBoy();
  spawnTreasure();
  //spawnSword();
  spawnMonsters();

  if(gold1Grp.isTouching(boy)){
	  chimeSound.play();
	  coinScore = coinScore+1;
	  gold1Grp.destroyEach();
  }

  if(gold2Grp.isTouching(boy)){
	  chimeSound.play();
	  treScore = treScore+1;
	  gold2Grp.destroyEach();
  }

  if(mon1Grp.isTouching(boy) && lifeScore===3){
	  mon1Grp.destroyEach();
	  life.changeAnimation("2life");
	  life.scale = 0.45;
	  lifeScore = 2;
	  alertSound.play();
  }

  if(mon2Grp.isTouching(boy) && lifeScore===3){
	mon2Grp.destroyEach();
	life.changeAnimation("2life");
	life.scale = 0.45;
	lifeScore = 2;
	alertSound.play();
}

if(mon3Grp.isTouching(boy) && lifeScore===3){
	mon3Grp.destroyEach();
	life.changeAnimation("2life");
	life.scale = 0.45;
	lifeScore = 2;
	alertSound.play();
}
  

  if(mon1Grp.isTouching(boy) && lifeScore===2){
	mon1Grp.destroyEach();
	life.changeAnimation("1life");
	life.scale = 0.433;
	lifeScore = 1;
	alertSound.play();
	}

  if(mon2Grp.isTouching(boy) && lifeScore===2){
	mon2Grp.destroyEach();
	life.changeAnimation("1life");
	life.scale = 0.433;
	lifeScore = 1;
	alertSound.play();
  }

  if(mon3Grp.isTouching(boy) && lifeScore===2){
	mon3Grp.destroyEach();
	life.changeAnimation("1life");
	life.scale = 0.433;
	lifeScore = 1;
	alertSound.play();
	}

	if(mon1Grp.isTouching(boy) && lifeScore===1){
		mon1Grp.destroyEach();
		life.changeAnimation("noLife");
		//life.scale = 0.4;
		lifeScore = 0;
		gameState = END;
		endSound.play();
	}

	if(mon2Grp.isTouching(boy) && lifeScore===1){
		mon2Grp.destroyEach();
		life.changeAnimation("noLife");
		//life.scale = 0.4;
		lifeScore = 0;
		gameState = END;
		endSound.play();
	}

	if(mon3Grp.isTouching(boy) && lifeScore===1){
		mon3Grp.destroyEach();
		life.changeAnimation("noLife");
		//life.scale = 0.4;
		lifeScore = 0;
		gameState = END;
		endSound.play();
	}

  }

  

  if(gameState === END){

	  //endSound.play();
	  
	  path.velocityX=0;
	  boy.visible = false;
	  mon1Grp.destroyEach();
	  mon2Grp.destroyEach();
	  mon3Grp.destroyEach();
	  gold2Grp.destroyEach();
	  path.visible = false;
	  background(255);
	  image(gameOverImg, 0,0,width,height);
	  //textSize(35);
	  //fill("white");
	  //stroke("black");
	  //strokeWeight(5);
	  //text("Press ctrl+r to replay!", width/2-150, height/2+140);	  
  }
 
  if(gameState === WIN){
		background(255);
		image(winImg, 0,0,width, height);
		boy.visible = false;
		path.visible = false;
		monsterGrp.destroyEach();
		gold1Grp.destroyEach();
		gold2Grp.destroyEach();
		life.x = width-550;
  }

  drawSprites();

  /*if(swordGrp.isTouching(boy)){
	  sword = sword+1;
	  swordGrp.destroyEach();
  }

  if(sword !== 0 && monsterGrp.isTouching(boy)){
	  monKills = monKills + 1;
	  sword = sword-1;
	  monsterGrp.destroyEach(); 	
  }*/

  

  /*if(sword === 0 && monsterGrp.isTouching(boy)){
	 boy.visible = false;
	 monsterGrp.setVelocityXEach(0);
	 swordGrp.setVelocityXEach(0);
	 gold2Grp.setVelocityXEach(0);
	 gold1Grp.setVelocityXEach(0);
	 monsterGrp.setVelocityYEach(0);
	 swordGrp.setVelocityYEach(0);
	 gold2Grp.setVelocityYEach(0);
	 gold1Grp.setVelocityYEach(0);
	 textSize(50);
	 text("Game Over", width/2, height/2);
  }*/
  
  
  
 
  textSize(40);
  fill("white");
  text(coinScore, width-90, 102);
  //text(sword, width-530, 60);
  text(treScore, width-280, 100);
  //text(monKills, width-730, 60);
}

function moveBoy(){
	if(keyDown("DOWN_ARROW")){
		boy.y = boy.y+10;
		}
  
		if(keyDown("UP_ARROW")){
		boy.y = boy.y-10;
		}

	if(boy.y<100){
		boy.y = 120;
	}

	if(boy.y>height-100){
		boy.y = height-120;
	}
	
}

function spawnTreasure(){
	if(frameCount % 134 === 0){
		gold = createSprite(width, random(200, height-200), 10, 10);
		gold.addImage(gold1_img);
		gold.scale = 0.3;
		gold.velocityX = -((10+treScore/12)*2);
		gold.lifetime = 300;
		gold1Grp.add(gold);
		//gold.debug = true;
		gold.setCollider("circle", 0, 50, 150);
	}

	if(frameCount % 225 === 0){
		gold2 = createSprite(width, random(200, height-200), 10, 10);
		gold2.addImage(gold2_img);
		gold2.scale = 0.3;
		gold2.velocityX = -((10+treScore/12)*2);
		gold2.lifetime = 300;
		gold2Grp.add(gold2);
		//gold2.debug = true;
	}

	
}

function spawnSword(){
	if(frameCount % 463 === 0){
		sword = createSprite(width, random(200, height-200), 10, 10);
		sword.addImage(sword_img);
		sword.scale = 0.8;
		sword.velocityX = -(10+sword);
		swordGrp.add(sword);
	}
}

function spawnMonsters(){

	if(frameCount % 138 === 0){
		mon1 = createSprite(width, random(100, height-100), 10, 10);
		mon1.addImage(monster1_img);
		mon1.scale = 0.25;
		mon1.velocityX = -((10+treScore/12)*2);
		mon1.lifetime = 300;
		mon1Grp.add(mon1);
		mon1.setCollider("circle", 0, 0, 280);
	}

	if(frameCount % 301 === 0){
		mon2 = createSprite(width*2, random(100, height-100), 10, 10);
		mon2.addImage(monster2_img);
		mon2.scale = 0.25;
		mon2.velocityX = -((10+treScore/12)*2);
		mon2.lifetime = 300;
		mon2Grp.add(mon2);
		mon2.setCollider("circle", 0, 0, 280);
	}

	if(frameCount % 225 === 0){
		mon3 = createSprite(width, random(100, height-100), 10, 10);
		mon3.addImage(monster3_img);
		mon3.scale = 0.25;
		mon3.velocityX = -((10+treScore/12)*2);
		mon3.lifetime = 300;
		mon3Grp.add(mon3);
		mon3.setCollider("circle", 0, 0, 280);
	}

}