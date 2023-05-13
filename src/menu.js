let selected = 0;

class Menu {
    constructor () {
	}
	
	//esc key pressed -> set game state to main menu
	static s_return()
	{
		if(keys[ESCAPE])
		{
			if(gameState == HOW_TO_PLAY)
				gameState = MAIN_MENU;
			else if(gameState == PLAY)
				gameState = MAIN_MENU;
			else if(gameState == EDITOR)
			{
				gameState = MAIN_MENU;
				editor.showHideButtons(false);
			}
			else if(gameState == GAME_MAP)
				gameState = MAIN_MENU;

			keys[ESCAPE] = 0;
		}
	}
	
	//manages player selection on main menu
	static s_select_option(max)
	{
		if(keys[UP_ARROW] && selected != 0)
		{
			selected--;
			keys[UP_ARROW] = 0;
		}
		if(keys[DOWN_ARROW] && selected != max)
		{
			selected++;
			keys[DOWN_ARROW] = 0;
		}
		if(keys[32] && selected == 0)
		{
			gameState = PLAY;
			camera.resetCameraPos();
			player.setSpawnPosition();
			camera.lookAtObj(player);
			camera.update();
			map.levels[map.curent_level].sort();
			keys[32] = 0;
		}
		if(keys[32] && selected == 1)
		{
			gameState = HOW_TO_PLAY;
			keys[32] = 0;
		}
		if(keys[32] && selected == 2)
		{
			gameState = EDITOR;
			camera.resetCameraPos();
			//camera.lookAtObj(null);
			editor.showHideButtons(true);
			map.levels[map.curent_level].sort();
			keys[32] = 0;
		}
		if(keys[32] && selected == 3)
		{
			gameState = GAME_MAP;
			camera.resetCameraPos();
			//camera.lookAtObj(null);
			keys[32] = 0;
		}
	}
	
	//draws main menu
	static s_draw()
	{
		background(220);
		fill(0);
		textSize(40);
		text('METRO EXPLORER', windowWidth/2, windowHeight/4);
		textSize(25);
		
		
		
			textAlign(LEFT)
			text('->', 250, windowHeight/4 + 150+selected*25);
			text('PLAY', windowWidth/2 - 50, windowHeight/4 + 150);
			text('HOW TO PLAY', windowWidth/2 - 50, windowHeight/4 + 175);
			text('EDITOR', windowWidth/2 - 50, windowHeight/4 + 200);
			text('METRO MAP', windowWidth/2 - 50, windowHeight/4 + 225);
			textAlign(CENTER)
		
		
	}
	
	//draws how to play menu
	static s_drawHowToPlay()
	{
		background(220);
		fill(0);
		textSize(40);
		text('HOW TO PLAY', windowWidth/2, windowHeight/4);
		textSize(20);
		text('Move = ← → ↑ ↓', windowWidth/2, (windowHeight/4)+100);
		text('Turn on/off flashlight = T', windowWidth/2, (windowHeight/4)+120);
		text('Drop Flare = Y', windowWidth/2, (windowHeight/4)+140);
		//text('Open/close doors = E', windowWidth/2, (windowHeight/4)+140);
		//text('Action/Attack = Space', windowWidth/2, (windowHeight/4)+160);
		//text('Switch weapon = Ctrl', windowWidth/2, (windowHeight/4)+180);
		//text('Reload weapon = R', windowWidth/2, (windowHeight/4)+200);
		text('Cancel/Menu = Esc', windowWidth/2, (windowHeight/4)+160);
	}
}