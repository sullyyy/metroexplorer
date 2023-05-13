class MiniMap {
    constructor () {
		
	}
	
	draw(){
		if(gameState == EDITOR)
			return;
		
		push();
		
		let startX = windowWidth - 200;
		let startY = windowHeight - 200;
		let l = map.levels[map.curent_level];
		
		pg_circle.clear();
		pg_minimap.clear();
		
		pg_minimap.fill(0);
		pg_minimap.rect(0,0,1000,800)
		
		for(let i = 0; i < l.sizeX; i++)
			{
				for(let j = 0; j < l.sizeY; j++)
				{
					if(l.lvl_array[i][j].group == "WALL" || l.lvl_array[i][j].group == "WALL_LIGHT")
					{
						pg_minimap.fill(25,25,25)
						pg_minimap.rect(startX + j*20 + camera.offSetX/5,startY + i*20 + camera.offSetY/5,20,20)
					}
					else if(l.lvl_array[i][j].game_id == 5)
					{
						
						pg_minimap.fill(139,69,19)
						pg_minimap.rect(startX + j*20 + camera.offSetX/5,startY + i*20 + camera.offSetY/5,20,20)
					}
					else
					{
						pg_minimap.fill(200,200,200)
						pg_minimap.rect(startX + j*20 + camera.offSetX/5,startY + i*20 + camera.offSetY/5,20,20)
					}
				}
			}
		
		pg_minimap.fill(0,0,255);
		//pg_minimap.circle(startX + player.x/100 + camera.offSetX/10,startY + player.y/100 + camera.offSetY/10,10);
		
		let posX = (player.x/100)*20
		let posY = (player.y/100)*20
		pg_minimap.circle(10+startX + posX + camera.offSetX/5,10+startY + posY + camera.offSetY/5,10);
		
		
		pg_circle.fill(255);
		pg_circle.circle(windowWidth - 110, windowHeight - 110, 200);
		
		let img_c = pg_minimap.get();
		
		img_c.mask(pg_circle.get());
		
		image(img_c,0,0);
		
		strokeWeight(3)
		stroke(255,0,0)
		noFill()
		circle(windowWidth - 100, windowHeight - 100, 200);
		
		pop();
	}
}