class Message {
    constructor (x,y,message,display) {
		this.x = x;
		this.y = y;
		this.message = message;
		this.display = display;
	}
	
	set(x,y,message,display)
	{
		this.x = x;
		this.y = y;
		this.message = message;
		this.display = display;
	}
	
	setMessage(message)
	{
		this.message = message;
	}
	
	displayed(bool)
	{
		this.display = bool;
	}
	
	draw()
	{
		if(!this.display)
			return;
		strokeWeight(4);
		fill(200,200,200);
		rect(windowWidth/2 - (windowWidth/2)/2, windowHeight/4 - (windowHeight/4)/2, 400, 200,20);
		textSize(12);
		fill(0,0,0);
		text(this.message,windowWidth/2 - (windowWidth/2)/2,windowHeight/4 - (windowHeight/4)/2,400,200)
		strokeWeight(1);
	}
}