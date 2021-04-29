
class tile {
	constructor(color,x,y,w,h,up,down,left,right) {
		this.color = color;
	
		this.x = x;
		this.y = y;
	
		this.w = w;
		this.h = h;
	
		this.collis = {
			up: up,
			down: down,
			left: left,
			right: right
		};
	}
}

tile.prototype.collision = function(ent) {

	if(!ent.collideany(this))
		return;

	// up and down

	if(this.collis.up && ent.y - ent.vel.y <= this.y - ent.h) {
		ent.y = this.y - ent.h;
		ent.vel.y = 0;
		ent.onfloor = true;
		return true;
	} if(this.collis.down && ent.y - ent.vel.y >= this.y + this.h) {
		ent.y = this.y + this.h;
		ent.vel.y = 0;
		return true;
	}

	// left and right

	if(this.collis.left && ent.x - ent.vel.x <= this.x - ent.w) {
		ent.x = this.x - ent.w;
		ent.vel.x = 0;
		return true;
	} if(this.collis.right && ent.x - ent.vel.x >= this.x + this.w) {
		ent.x = this.x + this.w;
		ent.vel.x = 0;
		return true;
	}

};