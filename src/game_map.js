class Station{
	constructor (id,x,y,name,color) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.name = name;
		this.color = color;
		this.hovered = false;
		this.flashingProg = 0;
		this.last = new Date().getTime();
		this.sens = 1;
	}
	
	getColor()
	{
		if(this.color == "red")
			return color(255, 0, 0);
		else if(this.color == "hanza")
			return color(87, 74, 69);
		else if(this.color == "polis")
			return color(19, 81, 96);
		else if(this.color == "emerald")
			return color(18, 95, 98);
		else if(this.color == "destroyed")
			return color(0, 0, 0);
	}
	
	getFaction()
	{
		if(this.color == "red")
			return "Red Line";
		else if(this.color == "hanza")
			return "Commonwealth Of The Stations Of The Ring Line (HANZA)";
		else if(this.color == "polis")
			return "Polis";
		else if(this.color == "emerald")
			return "Moscow State University (EMERALD CITY)";
		else if(this.color == "destroyed")
			return "-";
	}
	
	//drawing station
	draw()
	{
			//drawing stations icon on map
			image(stations_icons,this.x+camera.offSetX-10,this.y+camera.offSetY-10,20,20,game_map.stationsIconIdAssArray[this.color]*26,0,26,26);
		
			//flashing stations if current level
			if(map.curent_level == this.id)
				{
					noFill();
					strokeWeight(4);
					let now = new Date().getTime();
					let delta = now - this.last;
					if (delta >= 20) {
						this.last = now;
					this.flashingProg+=10*this.sens;
					if(this.flashingProg >= 255 || this.flashingProg <= 0)
						this.sens *= -1;
					}
					stroke(this.flashingProg, this.flashingProg, this.flashingProg);
					circle((this.x+camera.offSetX), (this.y+camera.offSetY), 20*game_scale);
				}
			
			//drawing red circle over station if hovered
			if(this.hovered)
			{
				noFill();
				strokeWeight(5);
				stroke(255, 0, 0);
				circle((this.x+camera.offSetX), (this.y+camera.offSetY), 20*game_scale);
				noStroke();
				fill(0);
				textSize(10);
				text(this.name, this.x+camera.offSetX, (this.y+camera.offSetY));
			}
		
		
			
			
		
	}
	
}

class InfoWindow {
	constructor () {
		this.show = false;
		this.crossHovered = false;
		this.stationHovID = 0;
	}
	
	update(){
		if(!this.show)
			return;
		
		let x = windowWidth/2-250+500-10;
		let y = windowHeight/2-200 + 10;
		this.crossHovered = false;
		
		//checking if cross hovered
		if (dist(x, y, mouseX, mouseY) <= 10)
			{
				this.crossHovered = true;
				
				//closing window
				if (mouseIsPressed === true)
					{
						this.show = false;
						this.crossHovered = false;
					}
			}
		
	}
	
	draw()
	{
		push();
		
			//draw window
			fill(255,255,255);
			stroke(0)
			rect(windowWidth/2-250,windowHeight/2-200,500,400)
		
			//draw cross
			if(this.crossHovered)
			{
				stroke(255,0,0);
				strokeWeight(4);
			}
			rect(windowWidth/2-250+500-20,windowHeight/2-200,20,20);
			strokeWeight(1);
			stroke(255,0,0)
			line(windowWidth/2-250+500-20,windowHeight/2-200,windowWidth/2-250+500,windowHeight/2-200+20)
			line(windowWidth/2-250+500,windowHeight/2-200,windowWidth/2-250+500-20,windowHeight/2-200+20)
		
			//draw text
			noStroke();
			fill(0);
			textAlign(LEFT);
			text(game_map.stations[this.stationHovID].name,windowWidth/2-250+5,windowHeight/2-200+10);
			let faction = game_map.stations[this.stationHovID].getFaction();
			text("FACTION : ",windowWidth/2-250+5,windowHeight/2-200+30);
			textSize(12);
			text(faction,windowWidth/2-250+5,windowHeight/2-200+50);
		
		pop();
	}
	
}

class Game_map {
	constructor () {
		this.stations = [];
		this.createStations();
		this.infoWindow = new InfoWindow();
		this.stationsIconIdAssArray = {};
		this.fillAssArray();
	}
	
	fillAssArray(){
		this.stationsIconIdAssArray["hanza"] = 0;
		this.stationsIconIdAssArray["red"] = 1;
		this.stationsIconIdAssArray["polis"] = 2;
		this.stationsIconIdAssArray["emerald"] = 3;
		this.stationsIconIdAssArray["destroyed"] = 4;
	}
	
	createStations(){
		
		//red line
		this.stations.push(new Station(0,500,400,"OKHOTNY RYAD","red"))
		this.stations.push(new Station(1,515,415,"TEATRAL'NAYA","red"))
		this.stations.push(new Station(2,530,430,"PLOSCHAD REVOLUTSII","red"))
		this.stations.push(new Station(3,540,360,"LUBYANKA","red"))
		this.stations.push(new Station(4,600,300,"CHISTYE PRUDY","red"))
		this.stations.push(new Station(5,615,285,"KRASNYE VOROTA","red"))
		this.stations.push(new Station(6,640,260,"KOMSOMOL'SKAYA","hanza"))
		this.stations.push(new Station(7,657,245,"KOMSOMOL'SKAYA","red"))
		this.stations.push(new Station(8,680,220,"KRASNOSEL'SKAYA","red"))
		this.stations.push(new Station(9,700,200,"SOKOL'NIKI","red"))
		this.stations.push(new Station(10,725,175,"PREOBRAZHENSKAYA PLOSCHAD'","red"))
		this.stations.push(new Station(11,745,155,"CHERKIZOVSKAYA","red"))
		this.stations.push(new Station(12,745,120,"ULITSA PODBEL'SKOGO","red"))
		this.stations.push(new Station(13,465,435,"BIBLIOTEKA IM. LENINA","polis"))
		this.stations.push(new Station(14,445,455,"BOROVITSKAYA","polis"))
		this.stations.push(new Station(15,430,435,"ARBATSKAYA","polis"))
		this.stations.push(new Station(16,445,420,"ALEKSANDROVSKIY SAD","polis"))
		this.stations.push(new Station(17,400,500,"KROPOTKINSKAYA","red"))
		this.stations.push(new Station(18,375,530,"PARK KULTURY","red"))
		this.stations.push(new Station(19,360,545,"PARK KULTURY","hanza"))
		this.stations.push(new Station(20,330,575,"FRUNZENSKAYA","red"))
		this.stations.push(new Station(21,300,600,"SPORTIVNAYA","red"))
		this.stations.push(new Station(22,265,635,"VOROB'EVY GORY","destroyed"))
		this.stations.push(new Station(23,240,665,"UNIVERSITET","emerald"))
		this.stations.push(new Station(24,215,690,"PROSPEKT VERNADSKOGO","emerald"))
		this.stations.push(new Station(25,190,715,"YUGO-ZAPADNAYA","emerald"))
		
		
		this.stations.push(new Station(26,595,230,"PROSPEKT MIRA","hanza"))
		this.stations.push(new Station(27,610,215,"PROSPEKT MIRA","hanza"))
		
		this.stations.push(new Station(28,450,215,"NOVOSLOBOSDKAYA","hanza"))
		
		this.stations.push(new Station(29,365,260,"BELORUSSKAYA","hanza"))
		
		this.stations.push(new Station(30,300,360,"KRASNOPRESNENSKAYA","hanza"))
		
		this.stations.push(new Station(31,320,500,"KIEVSKAYA","hanza"))
		
		this.stations.push(new Station(32,445,600,"OKTYABR'SKAYA","hanza"))
		
		this.stations.push(new Station(33,530,605,"DOBRYNINSKAYA","hanza"))
		
		this.stations.push(new Station(34,570,595,"PAVALETSKAYA","hanza"))
		
		this.stations.push(new Station(35,665,525,"TAGANSKAYA","hanza"))
		
		this.stations.push(new Station(36,700,435,"KURSKAYA","hanza"))
	}
	
	update(){
		
		//checking if stations is hovered by mouse
		for(let i = 0; i < this.stations.length; i++)
			{
				this.stations[i].hovered = false;
				let x = this.stations[i].x;
				let y = this.stations[i].y;
				if (dist(x, y, (mouseX - camera.offSetX), (mouseY - camera.offSetY)) <= 8)
					{
						this.stations[i].hovered = true;
						if (mouseIsPressed === true)
							{
								this.infoWindow.stationHovID = i;
								this.infoWindow.show = true;
							}
						return;
					}
			}
		
		this.infoWindow.update();
		
	}
	
	draw(){
		
		this.drawBase();
		this.drawLines();
		this.drawStations();
		this.drawInfoWindow();
		
	}
	
	drawInfoWindow()
	{
		if(this.infoWindow.show)
			this.infoWindow.draw();
	}
	
	drawStations()
	{
		push();
		for(let i = 0; i < this.stations.length;i++)
			{
				this.stations[i].draw();
			}
		pop();
	}
	
	
	
	drawBase(){
		
		//cleaning screen
		background(150,150,150);
		
		
		
		push();
		
			textSize(15);
			text("- METRO MAP -", windowWidth/2+camera.offSetX, 10 + camera.offSetY)
			strokeWeight(10); 
			stroke(87, 74, 69);
			noFill();
			circle(windowWidth/2+camera.offSetX, windowHeight/2+camera.offSetY, 400*game_scale);
		
		pop();
		
		image(factionslist,200+camera.offSetX,800+camera.offSetY);
	}
	
	drawLines(){
		
		//draw metro color lines
		push();
			strokeWeight(10);
			stroke(255,0,0);
			line(745+camera.offSetX, 120+camera.offSetY, 745+camera.offSetX, 150+camera.offSetY);
			line(745+camera.offSetX, 150+camera.offSetY, 300+camera.offSetX, 600+camera.offSetY);
			stroke(0,0,0);
			line(300+camera.offSetX, 600+camera.offSetY, 240+camera.offSetX, 665+camera.offSetY);
			stroke(18, 95, 98);
			line(240+camera.offSetX, 665+camera.offSetY, 190+camera.offSetX, 715+camera.offSetY);
		pop();
		
	}
	
	
}