
const MAIN_MENU = 0;
const PLAY = 1;
const HOW_TO_PLAY = 2;
const EDITOR = 3;
const GAME_MAP = 4;
const LVL_TRANSITION = 5;

let game_scale = 1.0;

let keys = [];

let  pg;
let  pg2;

let gameState = MAIN_MENU;
let fr = 30;

let windowWidth = 1000
let windowHeight = 800;

let font;
let fontSize = 40;

let assets_array = [];

let shadowsLighting_active = true;
let grid_active = true;
let hitboxshow_active = true;
let tileOptions_active = false;

//let therundmc = PUTE;

function preload() {
	
	//loading assets img
	data_0 = loadImage('assets/img/data_0.png');
	
	player_img = loadImage('assets/img/player.png');
	
	light_circle = loadImage('assets/img/test_circle.png');
	
	stations_icons = loadImage('assets/img/station_icons.png');
	
	factionslist = loadImage('assets/img/factionslist.png');
	
	//loading fonts
	font = loadFont('assets/font/joystix.ttf');
	
	//loading assets data
	loadJSON("./data/assets.json", function loadAssets_c(json){
			assets_array = json;
	});
	
	File.loadStations();
	File.loadTunnels();
}

async function wait(){
	await sleep(4000);
}

function setup() {
	
	//wait();
	
	//creating canvas
	cnv = createCanvas(windowWidth, windowHeight);
	let ctx = cnv.canvas.getContext('2d', {willReadFrequently: true});
	
	//creating an offscreen drawing buffer
	pg = createGraphics(windowWidth,windowHeight);
	
	pg_minimap = createGraphics(windowWidth,windowHeight);
	pg_circle = createGraphics(windowWidth,windowHeight);
	pg_circle.translate(10,10)
	
	//setting up framerate
	frameRate(fr);
	
	//setting up fonts and texts
	textFont(font);
	textSize(fontSize);
	textAlign(CENTER, CENTER);
	
	//creating camera
	camera = new Camera(0, 0,1000,800);
	
	//creating Player
	player = new Player(100,100,36,70,player_img,1000)
	
	//creating map
	map = new Map();
	
	//creating game metro map
	game_map = new Game_map();
	
	//creating editor
	editor = new Editor();
	
	//creating minimap
	minimap = new MiniMap();
	
	messageTravelTo = new Message(0,0,"press E to travel to ",false)
	
}

function draw() {
	
	//looping around gamestate
	switch (gameState) {
			
		case MAIN_MENU:
			Menu.s_draw();
	  		Menu.s_select_option(3);
		break;
			
		case HOW_TO_PLAY:
			background(255);
			Menu.s_drawHowToPlay();
			Menu.s_return();
		break;
			
		case PLAY:
			//camera.move();
			player.update();
			map.draw();
			Menu.s_return();
			drawFrameRate();
		break;
			
		case EDITOR:
			editor.update();
			map.draw();
			editor.draw();
			camera.move();
			Menu.s_return();
			drawFrameRate();
		break;
		
		case GAME_MAP:
			game_map.update();
			game_map.draw();
			camera.move();
			Menu.s_return();
			drawFrameRate();
		break;
			
		case LVL_TRANSITION:
			map.drawlvltrans();
		break;
	}
	
}

//draws framerate in the top right of window
function drawFrameRate()
{
	push();
		textSize(8);
		fill(0, 255, 0);
		text(int(getFrameRate()) + " fps", windowWidth-50, 50);
	pop();
}

//resizes canvas
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function keyPressed() {
	keys[keyCode] = 1;
}

function keyReleased() {
	keys[keyCode] = 0;	
}

function sleep(millisecondsDuration)
{
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  })
}