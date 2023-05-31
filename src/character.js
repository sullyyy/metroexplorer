class Character{
	 constructor (x, y, w, h, img, id) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.img = img;
		this.id = id;
		this.animation = new Animation(7,130);
		this.moving = false;
		 
		 this.faceDirX = 0;
		 this.faceDirY = 0;
		 
		//foot height
		this.d = 10;
	 }
	
	update(){
		
	}
	
	//drawing character
	draw(){
		//image(this.img, this.x + camera.offSetX, this.y+ camera.offSetY, this.w, this.h);
		this.drawAnimation()
	}
	
	drawAnimation(){
		
		//getting current frame from animation
		let frame = this.animation.updateAnimation()/100;
		let srcY = 0;
		
		//stop animation if character is immobile
		if(!this.moving)
			frame = 0;
		
		//getting facing direction of character
		if(this.faceDirY == -1)
			srcY = 70;
		if(this.faceDirX == 1)
			srcY = 140;
		if(this.faceDirX == -1)
		{
			//mirroring img if going to the left
			srcY = 140;
			push();
				translate(this.x + camera.offSetX,this.y+ camera.offSetY);
				scale(-1,1);
				image(this.img, -36, 0, this.w, this.h,frame*36,srcY,36,70);
			pop();
		}
		else
			//drawing img
			image(this.img, this.x + camera.offSetX, this.y+ camera.offSetY, this.w, this.h,frame*36,srcY,36,70);
		
	}
	
	//checking for collision with game objects
	handleCollision(x,y)
	{
		
		//blocking character when on map limit
		if(x < 0 || y < 0 || x + this.w > map.levels[map.curent_level].sizeY*100 || y + this.h > map.levels[map.curent_level].sizeX*100)
		{
			//console.log("map.levels[map.curent_level].sizeX ");
			return false;
			
		}
		
		//adjusting y to calc collision with feet
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
				if(i < 0 || j < 0 || i > map.levels[map.curent_level].sizeY || j > map.levels[map.curent_level].sizeX)
				{
					
					continue;
				}
					
				//getting tile
				let tile = map.levels[map.curent_level].lvl_array[j][i];
				
				//checking for oob
				if(tile == undefined)
				{
					continue;
				}
				
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

//checking collision between obj A and obj B
function checkCollisionAB(obj_A, obj_B)
{
	if(obj_A.x > obj_B.x && obj_A.x < obj_B.x + obj_B.w && obj_A.y > obj_B.y && obj_A.y < obj_B.y + obj_B.h
	  || obj_A.x + obj_A.w > obj_B.x && obj_A.x + obj_A.w < obj_B.x + obj_B.w && obj_A.y > obj_B.y && obj_A.y < obj_B.y + obj_B.h)
		return true;
	return false;
}

//player character class
class Player extends Character{
	constructor (x, y, w, h, img, id) {
		super(x, y, w, h, img, id);
		this.move_speed = 5;
		this.flashlightOn = false;
	}
	
	update(){
		this.move();
		this.checkPosition();
	}
	
	setSpawnPosition(){
		this.x = 200;
		this.y = 400;
	}
	
	spawnAt(x,y){
		this.x = x;
		this.y = y;
	}
	
	//checking if player middle foot point is over obj
	checkWalkOverMid(obj)
	{
		if(this.x + this.w/2 > obj.x && this.x + this.w/2 < obj.x + obj.w && this.y + (this.h - this.d/2) > obj.y && this.y + (this.h - this.d/2) < obj.y + obj.h)
			return true;
		return false;
	}
	
	//checks if player is standing on a special tile with interactivity
	checkPosition()
	{
		let i = floor((player.x+(player.w/2))/100);
		let j = floor((player.y+(player.h - 5))/100);
		
		//rail transition tile to another level
		if(player.x < 100 && map.levels[map.curent_level].lvl_array[j][i].game_id == 5)
		{
			if(map.levels[map.curent_level].id_left != -1)
			{
				messageTravelTo.setMessage("press E to travel to " + map.levels[map.levels[map.curent_level].id_left].name)
				messageTravelTo.display = true;
			}
		}
		else if(player.x > map.levels[map.curent_level].sizeY*100 - 100 && map.levels[map.curent_level].lvl_array[j][i].game_id == 5)
		{
			if(map.levels[map.curent_level].id_right != -1)
			{
				messageTravelTo.display = true;
				messageTravelTo.setMessage("press E to travel to " + map.levels[map.levels[map.curent_level].id_right].name)
			}
		}
		else
		{
			messageTravelTo.display = false;
		}
		
		//traps
		for(let k = 0; k < map.levels[map.curent_level].dynamic_elements.length;k++)
			{
				let t = map.levels[map.curent_level].dynamic_elements[k].obj;
				
				if(t instanceof Bear_Trap)
					{
						if(this.checkWalkOverMid(t) && t.open)
						{
						   messageTrap.display = true;
						   t.open = false;
						   this.move_speed = 0;
						}
					}
			}
	}
	
	move(){
		
		this.moving = false;
		
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
			
			//updating player variables
			this.moving = true;
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
			
			this.moving = true;
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
			
			this.moving = true;
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
			
			this.moving = true;
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
		//drop flare Y
		if(keys[89])
		{
			map.levels[map.curent_level].addDynamicElement(new Tile_To_Draw(1000, false, 0,0,new Flare_Item(player.x+player.w/2,player.y+player.h)));
			
			keys[89] = 0;
			
		}
		//Pressing the E key
		if(keys[69])
		{
			let i = floor((player.x+(player.w/2))/100);
			let j = floor((player.y+(player.h - 5))/100);
			
			//traveling to another level
			if(player.x < 100 && map.levels[map.curent_level].lvl_array[j][i].game_id == 5)
				{
					
					if(map.levels[map.curent_level].id_left != -1)
						{
							map.curent_level = map.levels[map.curent_level].id_left;
							//player.setSpawnPosition();
							player.spawnAt(map.levels[map.curent_level].sizeY*100-100,400)
							camera.update();
							gameState = LVL_TRANSITION;
						}
				}
			else if(player.x > map.levels[map.curent_level].sizeY*100 - 100 && map.levels[map.curent_level].lvl_array[j][i].game_id == 5)
				{
					
					if(map.levels[map.curent_level].id_right != -1)
						{
							map.curent_level = map.levels[map.curent_level].id_right;
							//player.setSpawnPosition();
							player.spawnAt(100,400)
							camera.update();
							gameState = LVL_TRANSITION;
						}
				}
			
			//freeing from trap
			if(player.move_speed == 0)
			{
				messageTrap.display = false;
				this.move_speed = 5;
			}
			
			
			keys[69] = 0;
			
		}
		
	}
	
	//drawing character
	draw(){
		super.draw();
		map.drawFlashLight();
		
		//hitbox
		/*push();
			noFill();
			stroke("red");
			rect(this.x+camera.offSetX,this.y+(this.h-this.d)+camera.offSetY,this.w,this.d);
		pop();*/
	}
	
}