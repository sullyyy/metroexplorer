class Camera {
    constructor (startX, startY,width, height) {
		this.offSetX = startX;
		this.offSetY = startY;
		this.width = width;
		this.height = height;
		this.obj = null;
	}
	
	lookAt(x,y){
		this.offSetX = windowWidth/2 - x;
		this.offSetY = windowHeight/2 - y;
	}
	
	lookAtObj(obj){
		this.obj = obj;
	}
	
	update()
	{
		if(this.obj === null)
			return;
		
		this.offSetX = windowWidth/2 - this.obj.x;
		this.offSetY = windowHeight/2 - this.obj.y;
		
	}
	
	resetCameraPos()
	{
		this.offSetX = 0;
		this.offSetY = 0;
	}
	
	move()
	{
		if(keys[LEFT_ARROW])
		{
			this.offSetX += 10;
		}
		if(keys[RIGHT_ARROW])
		{
			this.offSetX -= 10;
		}
		if(keys[UP_ARROW])
		{
			this.offSetY += 10;
		}
		if(keys[DOWN_ARROW])
		{
			this.offSetY -= 10;
		}
	}
	
	
}