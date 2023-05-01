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
	constructor (id,sizeX,sizeY) {
		this.id = id;
		this.sizeX = sizeX;
		this.sizeY = sizeY;
		if(id < 2)
			this.lvl_array = stationsData[id];
		else
		{
			this.lvl_array;
			this.create();
		}
		
		this.z_index_map = [];
		
		//console.log("stationsData[id]; ", stationsData[id])
		
		
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
		
		//adding player
		this.z_index_map.push(new Tile_To_Draw(1000, false, 0,0,player));
		
		//sorting by z index
		this.z_index_map.sort(function(a, b){return a.get_z_index() - b.get_z_index()});
	}
	
	resort(){
		//sorting by z index
		this.z_index_map.sort(function(a, b){return a.get_z_index() - b.get_z_index()});
	}
	
}

class Map {
	constructor () {
		
		this.img_array = this.loadImgs();
		
		this.levels = [];
		this.curent_level = 0;
		
		this.addLevels();
		
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
		this.levels.push(new Level(0,10,10));
		this.levels.push(new Level(1,5,5));
		this.levels.push(new Level(2,10,10));
		this.levels.push(new Level(3,10,10));
	}
	
	draw(){
		
		//draw floor texture
		this.drawFloor();
		
		//draw background objects and dynamic objects
		this.drawGameObjects();
		
		//draw shadows and lighting
		this.drawShadowsLighting();
		
		//draw grid (editor only)
		this.drawGrid();
		
		//draw hud
		this.drawHUD();
	}
	
	drawFloor(){
		
		//cleaning screen
		background(47,47,47);
		
		//drawing floor texture
		fill(88,88,88);
		rect(camera.offSetX*game_scale,camera.offSetY*game_scale,100*this.levels[this.curent_level].sizeY*game_scale,100*this.levels[this.curent_level].sizeX*game_scale)
	}
	
	drawGameObjects(){
		
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
						let srcW = tile.obj.srcW;
						let srcH = tile.obj.srcH;
						let destW = srcW;
						let destH = srcH;
						
						//drawing tile
						image(this.img_array[img_array_id],destX,destY,destW,destH,srcX,srcY,srcW,srcH);
						
						//drawHitbox
						this.drawHitbox(tile,destX,destY);
						
						//draws tile info
						/*push();
							fill(0)
							textSize(10);
							text("z " + tile.get_z_index(),destX + 50,destY + 50)
						pop();*/
						
					}
		
				if(gameState == EDITOR)
					continue;
		
				
		//draw dynamic objects (characters, effects, pickable items, etc)
				if(!tile.bckgrnd)
					{
						tile.obj.draw();
					}
			}
		
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
	
	//draw shadows and lighting
	drawShadowsLighting()
	{
		if(!shadowsLighting_active)
			return;
		
		//creating shadow dark color
		let shadows = color(50, 50, 50);
		//shadows.setAlpha(128);
		
		//clearing offscreen buffer
		pg.clear();
		
		//drawing shadows (dark rectangle)
  		pg.fill(shadows);
		pg.rect(camera.offSetX,camera.offSetY,100*this.levels[this.curent_level].sizeY*game_scale,100*this.levels[this.curent_level].sizeX*game_scale)
		
		//drawing lights (white shapes)
		pg.noStroke();
		pg.fill(255,255,255);
		
		//drawing player close vision circle
		//pg.circle(player.x+player.w/2+camera.offSetX, player.y+player.h/2+camera.offSetY, 150);
		
		//drawing player torchlight (white triangle)
		let tlx1 = player.x+player.w/2+camera.offSetX + 250*player.faceDirX;
		let tly1 = player.y+player.h/2+camera.offSetY - 40;
		
		let tlx2 =  player.x+player.w/2+camera.offSetX + 250*player.faceDirX;
		let tly2 =  player.y+player.h/2+camera.offSetY + 40;
		
		if(player.faceDirY == 1 || player.faceDirY == -1)
		{
			tlx1 = player.x+player.w/2+camera.offSetX - 40;
			tly1 = player.y+player.h/2+camera.offSetY + 250*player.faceDirY;
		
			tlx2 =  player.x+player.w/2+camera.offSetX + 40;
			tly2 =  player.y+player.h/2+camera.offSetY + 250*player.faceDirY;
		}
		
		
		
		//searching for lights in level and drawing white circles
		for(let i = 0; i < this.levels[this.curent_level].z_index_map.length; i++)
			{
				let tile = this.levels[this.curent_level].z_index_map[i];
				
				if(tile.obj.group == "WALL_LIGHT" || tile.obj.group == "FIREPIT_LIGHT")
					//pg.circle(tile.j*100+50+camera.offSetX, tile.i*100+50+camera.offSetY, 150);
					pg.image(light_circle,tile.j*100+50+camera.offSetX-75,tile.i*100+50+camera.offSetY-75)
			}
		
		//drawing player torchlight (white triangle)
		if(gameState != EDITOR && player.flashlightOn)
			pg.triangle(player.x+player.w/2+camera.offSetX, player.y+player.h/2+camera.offSetY,tlx1,tly1,tlx2,tly2);
		
		//setting blend mode to multiply to make dark dark and light light
		blendMode(MULTIPLY);
		
		//blending offscreen buffer with drawn map
		image(pg, 0, 0);
		
		//returning to normal blend mode
		blendMode(BLEND);
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
		
			text('Station : ' + game_map.stations[map.curent_level].name, windowWidth/2,10);
		pop();
	}
}