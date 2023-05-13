class Empty_Tile {
	constructor() {
	  this.game_id = 0;
	  this.draw_id = 0;
	  this.data_id = 0;
	  this.hitboxX = 0;
	  this.hitboxY = 0;
	  this.hitboxW = 0;
	  this.hitboxH = 0;
	  this.decalX = 0;
	  this.decalY = 0;
	  this.srcW = 100;
	  this.srcH = 100;
	  this.customZIndex = 0;
	  this.group = "FLOOR";
	}
}

class FirePit_Tile {
	constructor(i,j) {
	  this.game_id = 10;
	  this.draw_id = 10;
	  this.data_id = 0;
	  this.hitboxX = 30;
	  this.hitboxY = 50;
	  this.hitboxW = 40;
	  this.hitboxH = 0;
	  this.decalX = 0;
	  this.decalY = 0;
	  this.srcW = 100;
	  this.srcH = 100;
	  this.customZIndex = 0;
	  this.group = "FIREPIT_LIGHT";
		this.i = i;
		this.j = j;
		this.y = i*100 + this.hitboxY;
		this.h = this.hitboxH;
	 this.animation = new Fire_Animation(4);
	}
	
	draw(){
		image(map.img_array[0],this.j*100+camera.offSetX,this.i*100+camera.offSetY,100,100,1000,this.animation.updateAnimation(),100,100);
	}
	
	
}

class Flare_Item {
	constructor(x,y) {
		this.x = x;
		this.y = y;
		this.h = 5;
		this.i = floor(x/100);
		this.j = floor(y/100);
		this.group = "LIGHT";
	}
	
	draw(){
		//image(map.img_array[0],this.j*100+camera.offSetX,this.i*100+camera.offSetY,100,100,1000,this.animation.updateAnimation(),100,100);
		push();
			fill(255,0,0);
			rect(this.x+camera.offSetX,this.y+camera.offSetY,10,5);
		pop();
	}
	
	
}



class Tile_To_Draw {
	constructor(tile_id,bckgrnd,i,j,obj) {
		this.tile_id = tile_id;
		this.bckgrnd = bckgrnd;
		this.i = i;
		this.j = j;
		this.obj = obj;
	}
	
	//returning z index of tile 
	get_z_index(){
		//checking if tile is background
		if(this.bckgrnd)
		{
			//returning 0 if floor/ if not calculates and return z index based on tile positions and hitboxes
			if(this.obj.group == "FLOOR")
				return 0 + this.obj.customZIndex;
			else
				return (this.i*100 + this.obj.hitboxY + this.obj.hitboxH);
		}
		//dynamic obj
		else
			return (this.obj.y + this.obj.h);
	}
}


class Level {
	constructor (id,name,sizeX,sizeY,id_left,id_right) {
		this.id = id;
		this.name = name;
		this.sizeX = sizeX;
		this.sizeY = sizeY;
		this.dynamic_elements = [];
		this.id_left = id_left;
		this.id_right = id_right;
		
		//id < 2 = stations
		if(id < 2)
		{
			this.lvl_array = stationsData[id];
			this.dynamic_elements = stationsDataDyn[id];
		}
		//id >= 1000 = tunnels
		else if(id >= 1000)
		{
			this.lvl_array = tunnelData[id - 1000];
			this.dynamic_elements = tunnelDataDyn[id - 1000];
			
		}
		//create empty level
		else
		{
			this.lvl_array;
			this.create();
		}
		
		this.z_index_map = [];
		//this.dynamic_elements = [];
		
		this.sort();
		
		
	}
	
	create(){
		this.createEmptyMap();
		//this.sort();
	}
	
	
	//initializes empty map
	createEmptyMap(){
		this.lvl_array = new Array(this.sizeX+1);
		
		for (var i = 0; i < this.lvl_array.length; i++) {
			this.lvl_array[i] = new Array(this.sizeY+1);
		}
		
		for(let i = 0; i < this.sizeX; i++)
			{
				for(let j = 0; j < this.sizeY; j++)
				{
					this.lvl_array[i][j] = new Empty_Tile();
				}
			}
		
		this.dynamic_elements = [];
	}
	
	//adding tiles to draw list and sorting by z index
	sort()
	{
		let tile_id = 0;
		this.z_index_map = [];
		
		//going over lvl_array to add tiles to draw list
		for(let i = 0; i < this.sizeX; i++)
			{
				for(let j = 0; j < this.sizeY; j++)
				{
					let obj = this.lvl_array[i][j];
					this.z_index_map.push(new Tile_To_Draw(tile_id, true, i,j,obj))
					tile_id++;
				}
			}
		
		//adding dynamic elements (firepits, etc)
		this.z_index_map = this.z_index_map.concat(this.dynamic_elements);
		
		//adding player
		this.z_index_map.push(new Tile_To_Draw(1000, false, 0,0,player));
		
		//sorting by z index
		this.z_index_map.sort(function(a, b){return a.get_z_index() - b.get_z_index()});
	}
	
	resort(){
		//sorting by z index
		this.z_index_map.sort(function(a, b){return a.get_z_index() - b.get_z_index()});
	}
	
	//adding dynamic elements to list and z index
	addDynamicElement(obj){
		
		this.dynamic_elements.push(obj);
		
		this.z_index_map.push(this.dynamic_elements[this.dynamic_elements.length-1])
		
		this.z_index_map.sort(function(a, b){return a.get_z_index() - b.get_z_index()});
		
	}
	
}

class Map {
	constructor () {
		
		this.img_array = this.loadImgs();
		
		this.levels = [];
		this.curent_level = 0;
		
		this.addLevels();
		
		this.lastLvlTrans = new Date().getTime();
		this.lvltransframe = 0;
		
		this.fire_animation = new Fire_Animation(4);
		
	}
	
	//loading tile imgs
	loadImgs()
	{
		let r = [];
		
		r.push(data_0);
		
		return r;
	}
	
	
	//adding levels to map
	addLevels(){
		//stations
		this.levels.push(new Level(0,"OKHOTNY RYAD",10,10,-1,1000));
		this.levels.push(new Level(1,"TEATRAL'NAYA",10,10,1000,1001));
		//this.levels.push(new Level(2,5,20));
		//tunnels
		this.levels[1000] = new Level(1000,"DARK TUNNEL",5,20,0,1);
		this.levels[1001] = new Level(1001,"DARK TUNNEL",5,20,1,-1);
	}
	
	draw(){
		
		if(gameState == LVL_TRANSITION)
			return;
		
		//draw floor texture
		this.drawFloor();
		
		//draw background objects and dynamic objects
		this.drawGameObjects();
		
		//draw grid (editor only)
		this.drawGrid();
		
		//draw hud
		this.drawHUD();
		
		//draw minimap
		minimap.draw();
		
		//draw messages
		messageTravelTo.draw();
	}
	
	drawFloor(){
		
		//cleaning screen
		background(47,47,47);
		
		//drawing floor texture
		fill(88,88,88);
		rect(camera.offSetX*game_scale,camera.offSetY*game_scale,100*this.levels[this.curent_level].sizeY*game_scale,100*this.levels[this.curent_level].sizeX*game_scale)
		
		
	}
	
	drawGameObjects(){
		
	    pg.clear();
		
		
		
		//looping around z index drawing list
		for(let i = 0; i < this.levels[this.curent_level].z_index_map.length; i++)
			{
				let tile = this.levels[this.curent_level].z_index_map[i];
				
				//draw static objects (walls, floors, etc)
				if(tile.bckgrnd)
					{
						//getting tile data before drawing
						let img_array_id = tile.obj.data_id;
						let destX = tile.j*100+camera.offSetX + tile.obj.decalX;
						let destY = tile.i*100+camera.offSetY + tile.obj.decalY;
						let srcX = tile.obj.draw_id*100;
						let srcY = 0;
						if(tile.obj.group == "WALL_LIGHT")
							srcY = this.fire_animation.updateAnimation();
						let srcW = tile.obj.srcW;
						let srcH = tile.obj.srcH;
						let destW = srcW;
						let destH = srcH;
						
						//drawing tile
						image(this.img_array[img_array_id],destX,destY,destW,destH,srcX,srcY,srcW,srcH);
						
						//making tile darker
						this.drawDarkness(destX,destY,destW,destH)
						
						//drawHitbox
						this.drawHitbox(tile,destX,destY);
						
						//draws tile info
						/*push();
							fill(0)
							textSize(10);
							text("z " + tile.get_z_index(),destX + 50,destY + 50)
						pop();*/
						
					}
		
				//if(gameState == EDITOR)
					//continue;
		
				
		//draw dynamic objects (characters, effects, pickable items, etc)
				if(!tile.bckgrnd)
					{
						tile.obj.draw();
						//draws tile info
						push();
							fill(0)
							textSize(10);
							text("z " + tile.get_z_index(),player.x + camera.offSetX + 25,player.y + camera.offSetY + 25)
						pop();
					}
			}
		
		//draws lighting
		this.drawLighting();
		
		//setting blendMode to apply darkness and lights to map
		blendMode(MULTIPLY  );
		
		//blending offscreen buffer with drawn map
		image(pg, 0, 0);
		
		//returning to normal blend mode
		blendMode(BLEND);
	}
	
	//draw hitbox of objects
	drawHitbox(tile,destX,destY)
	{
		if(!hitboxshow_active || gameState == PLAY)
			return;
		
		//getting obj data
		let hitboxX = tile.obj.hitboxX
		let hitboxY = tile.obj.hitboxY
		let hitboxW = tile.obj.hitboxW
		let hitboxH = tile.obj.hitboxH
		
		//drawing red rect 
		push();
			noFill();
			stroke(255,0,0);
			rect(destX+hitboxX,destY+hitboxY,hitboxW,hitboxH);
		pop();
	}
	
	//making tile at coord darker
	drawDarkness(x,y,w,h)
	{
		if(!shadowsLighting_active)
			return;
		
		let shadows_color = 5;
		
		if(this.curent_level < 1000)
			shadows_color = 55;
		
		let shadows = color(shadows_color, shadows_color, shadows_color);
		
		//drawing shadows (dark rectangle)
		pg.noStroke();
  		pg.fill(shadows);
		pg.rect(x,y,w,h)
	}
	
	//draws lighting in level
	drawLighting()
	{
		if(!shadowsLighting_active)
			return;
		
		pg.fill(255)
			
		//searching for lights in level and drawing white circles
		for(let i = 0; i < this.levels[this.curent_level].z_index_map.length; i++)
			{
				let tile = this.levels[this.curent_level].z_index_map[i];
				
				if(tile.obj.group == "WALL_LIGHT")
					pg.image(light_circle,tile.j*100+50+camera.offSetX-75,tile.i*100+50+camera.offSetY-75)
				else if(tile.obj.group == "FIREPIT_LIGHT")
					pg.image(light_circle,tile.j*100+50+camera.offSetX-150,tile.i*100+50+camera.offSetY-150,300,300)
				else if(tile.obj.group == "LIGHT")
				{
					pg.tint(255, 0, 0, 128);
					pg.image(light_circle,tile.obj.x+camera.offSetX-75,tile.obj.y+camera.offSetY-75,150,150)
					pg.noTint();
				}
			}
	}
	
	
	//draw flashlight
	drawFlashLight()
	{
		if(!shadowsLighting_active)
			return;
		
		
		//calculating triangle coord
		let tlx1 = player.x+player.w/2+camera.offSetX + 250*player.faceDirX;
		let tly1 = player.y+player.h/2+camera.offSetY - 40;
		
		let tlx2 =  player.x+player.w/2+camera.offSetX + 250*player.faceDirX;
		let tly2 =  player.y+player.h/2+camera.offSetY + 40;
		
		//checking if going up or down
		if(player.faceDirY == 1 || player.faceDirY == -1)
		{
			tlx1 = player.x+player.w/2+camera.offSetX - 40;
			tly1 = player.y+player.h/2+camera.offSetY + 250*player.faceDirY;
			
			tlx2 =  player.x+player.w/2+camera.offSetX + 40;
			tly2 =  player.y+player.h/2+camera.offSetY + 250*player.faceDirY;
			
			//getting start tile pos
			let i = floor((player.x+player.w)/100)
			let j = floor((player.y+player.h)/100)
			
			//recalculating triangle coord to stop at walls (up)
			if(player.faceDirY == -1)
			{
				for(let k = 1; k < 3;k++)
				{
					if(map.levels[map.curent_level].lvl_array[j-k][i].group == "WALL" || map.levels[map.curent_level].lvl_array[j-k][i].group == "WALL_LIGHT")
					{
						tly2 =  (j-k)*100 + camera.offSetY;
						tly1 =  (j-k)*100 + camera.offSetY;
						break;
					}
				}
			}
			//recalculating triangle coord to stop at walls (down)
			else if(player.faceDirY == 1)
			{
				for(let k = 0; k < 3;k++)
				{
					if(map.levels[map.curent_level].lvl_array[j+k][i].group == "WALL" || map.levels[map.curent_level].lvl_array[j+k][i].group == "WALL_LIGHT")
					{
						tly2 =  (j+k)*100 + 100 + camera.offSetY;
						tly1 =  (j+k)*100 + 100 + camera.offSetY;
						break;
					}
				}
			}
			
			
		
			
		}
		
		//drawing player torchlight (white triangle)
		pg.fill(255,255,255);
		if(gameState != EDITOR && player.flashlightOn)
			pg.triangle(player.x+player.w/2+camera.offSetX, player.y+player.h/2+camera.offSetY,tlx1,tly1,tlx2,tly2);
	}
	
	//drawing grid
	drawGrid(){
		
		if(!grid_active || gameState == PLAY)
			return;
		
		push();
			let col = color(0,0,0);
			col.setAlpha(128);
			stroke(col);
			noFill();
			for(let i = 0; i < map.levels[map.curent_level].sizeX*map.levels[map.curent_level].sizeY;i++)
			{
				let x = floor(i / map.levels[map.curent_level].sizeY);
				let y = i % map.levels[map.curent_level].sizeX;
				rect(x*100+camera.offSetX,y*100+camera.offSetY,100,100);
			}
		pop();
			
	}
	
	drawHUD(){
		
		if(gameState == EDITOR)
			return;
		
		push();
			fill(0);
			stroke(255);0
			textSize(10);
			text('life', 50 , 10);
		
			text('hunger', 950 , 10);
			text('thirst', 950 , 20);
			text('radiation', 950 , 30);
			text('sleep', 950 , 40);
		
			if(map.curent_level >= 1000)
				text('Tunnel', windowWidth/2,10);
			else
				text('Station : ' + game_map.stations[map.curent_level].name, windowWidth/2,10);
		pop();
	}
	
	drawlvltrans()
	{
		let now = new Date().getTime();
		let delta = now - this.lastLvlTrans;
		if (delta >= 33) {
			this.lastLvlTrans = now;
			let squareColor = color(0, 0, 0);
			squareColor.setAlpha(20*this.lvltransframe);
			fill(squareColor);
			rect(0,0,windowWidth,windowHeight)
			this.lvltransframe++;
			if(this.lvltransframe == 10)
			{
				this.lvltransframe = 0;
				gameState = PLAY;
				noTint();
			}
		}
	}
}