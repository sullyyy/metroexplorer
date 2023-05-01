class Character{
	 constructor (x, y, w, h, img, id) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.img = img;
		this.id = id;
		 
		 this.faceDirX = 0;
		 this.faceDirY = 0;
		 
		this.d = 10;
	 }
	
	update(){
		
	}
	
	//drawing character
	draw(){
		image(this.img, this.x + camera.offSetX, this.y+ camera.offSetY, this.w, this.h);
	}
	
	//checking for collision with game objects
	handleCollision(x,y)
	{
		
		//blocking character when on map limit
		if(x < 0 || y < 0 || x + this.w > map.levels[map.curent_level].sizeX*100 || y + this.h > map.levels[map.curent_level].sizeY*100)
			return false;
		
		//adjusting y to calc collision with feets
		y+=this.h;
		
		let i;
		let j;
		
		
		//checking 9 tiles around character
		for(let k = -1; k < 2; k++)
		{
			for(let l = -1; l < 2; l++)
			{
				//getting tile coord
				i = floor(x/100) + k;
				j = floor(y/100) + l;
				
				//checking for oob
				if(i < 0 || j < 0 || i > map.levels[map.curent_level].sizeX || j > map.levels[map.curent_level].sizeY)
					continue;
					
				//getting tile
				let tile = map.levels[map.curent_level].lvl_array[j][i];
				
				//checking for oob
				if(tile == undefined)
					continue;
				
				//checking collision between character and tile hitboxes 
				if(x > i*100+tile.hitboxX && x < i*100 + tile.hitboxX + tile.hitboxW && y > j*100 + tile.hitboxY && y < j*100 + tile.hitboxY + tile.hitboxH
				  || x + this.w > i*100+tile.hitboxX && x + this.w < i*100 + tile.hitboxX + tile.hitboxW && y > j*100 + tile.hitboxY && y < j*100 + tile.hitboxY + tile.hitboxH
				  || x > i*100+tile.hitboxX && x < i*100 + tile.hitboxX + tile.hitboxW && y - this.d > j*100 + tile.hitboxY && y - this.d < j*100 + tile.hitboxY + tile.hitboxH
				  || x + this.w > i*100+tile.hitboxX && x + this.w < i*100 + tile.hitboxX + tile.hitboxW && y - this.d > j*100 + tile.hitboxY && y - this.d < j*100 + tile.hitboxY + tile.hitboxH)
					return false;
				
			}
		}
		
		return true;
	}
	
}

class Player extends Character{
	constructor (x, y, w, h, img, id) {
		super(x, y, w, h, img, id);
		this.move_speed = 5;
		this.flashlightOn = false;
	}
	
	update(){
		this.move();
	}
	
	setSpawnPosition(){
		this.x = 200;
		this.y = 400;
	}
	
	move(){
		//left arrow pushed
		if(keys[LEFT_ARROW])
		{
			//checking for collision
			if(this.handleCollision(this.x - this.move_speed, this.y))
			{
				//moving player
				this.x -= this.move_speed;
				//updating camera pos
				camera.update();
				//resorting the draw list
				map.levels[map.curent_level].resort();
			}
			
			this.faceDirX = -1;
			this.faceDirY = 0;
			
		}
		//right arrow pushed
		if(keys[RIGHT_ARROW])
		{
			//checking for collision
			if(this.handleCollision(this.x + this.move_speed, this.y))
			{
				this.x += this.move_speed;
				camera.update();
				map.levels[map.curent_level].resort();
			}
			
			this.faceDirX = 1;
			this.faceDirY = 0;
			
		}
		//up arrow pushed
		if(keys[UP_ARROW])
		{
			//checking for collision
			if(this.handleCollision(this.x, this.y - this.move_speed))
			{
			
				this.y -= this.move_speed;
				camera.update();
				map.levels[map.curent_level].resort();
			}
			
			this.faceDirY = -1;
			this.faceDirX = 0;
		}
		//down arrow pushed
		if(keys[DOWN_ARROW])
		{
			
			//checking for collision
			if(this.handleCollision(this.x - this.move_speed, this.y + this.move_speed))
			{
				this.y += this.move_speed;
				camera.update();
				map.levels[map.curent_level].resort();
			}
			
			this.faceDirY = 1;
			this.faceDirX = 0;
		}
		//turn on/off flashlight T
		if(keys[84])
		{
			if(this.flashlightOn)
				this.flashlightOn = false;
			else
				this.flashlightOn = true;
			
			keys[84] = 0;
			
		}
		
	}
	
}