class Animation {
	constructor (nbrOfFrames) {
		this.last = new Date().getTime();
		this.frame = 0;
		this.nbrOfFrames = nbrOfFrames;
		this.going = true;
		
	}
	
	updateAnimation(){
		
		let now = new Date().getTime();
		let delta = now - this.last;
		if (delta >= 100) {
			
			this.frame++;
			this.last = now;
			if(this.frame > this.nbrOfFrames)
			{
				this.frame = 0;
				
			}
		}
		
		return this.frame*100;
		
	}
}

class Fire_Animation extends Animation{
	constructor (nbrOfFrames) {
		super(nbrOfFrames);
	}
	
}