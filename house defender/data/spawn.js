
var spawn = {};


//// SPAWN METEOR FOE ////

spawn.meteor = function(x,y) {
	var obj = new entity('meteor','#87181e',x,y,15,15,4,7,0,0);

	var randsize = 3;
	obj.w = obj.h = Math.round(Math.random() * randsize*2 + (obj.w - randsize));

	obj.reduce = 30;
	obj.redtick = 0;

	obj.vel.y = Math.random() * 1.2 + 1.5;
	obj.vel.x = (player.x - obj.x)*0.02;

	obj.kb.ammt = obj.vel.x*3;

	obj.update = function() {

		// update position
		this.x = this.x + this.vel.x;
		this.y = this.y + this.vel.y;

		// update size
		if(this.redtick >= this.reduce) {
			this.shrink();
			this.redtick = 0;
	
			if(this.w <= 0)
				this.destroy();
		}
	
		this.redtick++;

		// check collision
		if(this.collideany(player)) {
			player.bedamaged(this);
			this.destroy();
		} else {
			// with tiles
			for(var i = 0; i < tiles.length; i++) {
				if(this.sinkany(tiles[i])) {
					// ...
					this.destroy();
				}
			}
		}

	};

	return Object.create(obj);
}

//// SPAWN GUN BULLET ////

spawn.bullet = function(g,ent) {
	var obj = new entity(g.name,g.color,0,0,g.size,g.size,0,g.damage,g.kb,0);

	obj.friendly = true; // makes sure bullet doesn't hurt itself or other bullets

	obj.x = ent.x + ent.w*0.5 - obj.w*0.5;
	obj.y = ent.y + ent.h*0.5 - obj.h*0.5;

	obj.vel = {
		x: g.vel.x,
		y: g.vel.y
	};
	obj.accel = {
		x: g.accel.x,
		y: g.accel.y
	};

	obj.reduce = g.reduce;
	obj.redtick = 0;
	obj.spread = g.spread;

	if(!ent.lookingright)
		obj.vel.x = -obj.vel.x;
	var vely = obj.vel.y;

	obj.vel.x = obj.vel.x + ent.vel.x*0.5; // realistic shooting...? don't know if i should keep this
	obj.vel.y = Math.random() * obj.spread*2 + (vely - obj.spread);

	obj.update = function() {
		// update velocity
		this.vel.x = this.vel.x + this.accel.x;
		this.vel.y = this.vel.y + this.accel.y;

		if(this.vel.x > 0)
			this.lookingright = true;
		else if(this.vel.x < 0)
			this.lookingright = false;
	
		this.x = this.x + this.vel.x;
		this.y = this.y + this.vel.y;
	
		// update size
		if(this.redtick >= this.reduce) {
			this.shrink();
			this.redtick = 0;
	
			if(this.w <= 0)
				this.destroy();
		}
		this.redtick++;

		// check collision
		for(var i = 0; i < ents.length; i++) {
			if(ents[i].friendly)
				continue;
			if(this.collideany(ents[i])) {
				ents[i].bedamaged(this);
				this.destroy();
			}
		}
	};

	return obj;
};

//// SPAWN CAMERA ////

spawn.camera = function() {
	var obj = {
		x: 0,
		y: 0,
		focus: {
			x: 0.1,
			y: 0.05
		},
		adjust: function() {
			this.x = this.x + ((-player.x + c.width*0.5) - this.x)*this.focus.x;
			this.y = this.y + ((-player.y + c.height*0.5) - this.y + 15)*this.focus.y;
		}
	};
	
	return obj;
};

//// SPAWN PLAYER ////

spawn.player = function() {
	var obj = new entity('test subject','#00bfff',0,0,5,7,50,0,0,0);

	obj.vel = {
		x: 0,
		y: 0
	};
	obj.accel = {
		x: 0.3,
		y: 0.2
	};
	obj.max = {
		x: 1.5,
		y: 2
	};

	obj.canjump = false;
	obj.jumpvalue = -3;

	// reuse class function :)
	var entjump = obj.constructor.prototype.jump;

	obj.jump = function() {
		var result = entjump.apply(this,arguments);
		if(!result)
			return result;

		// dynamic jumping
		var ent = this;
		conds.post.push({
			fall: ent.accel.y*0.6,
			check: function() {
				if(keymodule.keys[87] && !ent.onfloor)
					ent.vel.y -= this.fall;
				else
					return true;
			}
		});

		return result;
	};

	obj.gunindex = 2;
	obj.firetick = guns[obj.gunindex].firerate;

	obj.update = function() {
		/// HANDLE KEY INPUT
		this.moving = false;
		if(this.alive) {
			// handle a and d keys
			if(keymodule.keys[68] && !keymodule.keys[65]) {
				this.moving = true;
				this.lookingright = true;
			} else if(keymodule.keys[65] && !keymodule.keys[68]) {
				this.moving = true;
				this.lookingright = false;
			}
	
			// handle shooting
			if(keymodule.keys[16] && this.firetick >= guns[this.gunindex].firerate) {
				this.firetick = 0;
				guns[this.gunindex].entityshoot(this);
			}
			this.firetick++;
		}

		// update velocity
		if(this.moving && this.alive) {
			if(this.lookingright) {
				this.vel.x = this.vel.x + this.accel.x;
				if(this.vel.x > this.max.x)
					this.vel.x = this.max.x;
			}
			else {
				this.vel.x = this.vel.x - this.accel.x;
				if(this.vel.x < -this.max.x)
					this.vel.x = -this.max.x;
			}
		} else {
			// stabalize velocity
			this.vel.x = this.vel.x * 0.9;
			if(this.vel.x < 0.1 && this.vel.x > -0.1)
				this.vel.x = 0;
		}

		this.vel.y = this.vel.y + this.accel.y;
		if(this.vel.y > this.max.y)
			this.vel.y = this.max.y;

		// update position
		this.x = this.x + this.vel.x;
		this.y = this.y + this.vel.y;

		// check collision
		prefloor = this.onfloor;
		this.collidetiles();

		// coyote jumping
		if(prefloor && !this.onfloor) {
			this.canjump = true;
			var ent = this;
			conds.pre.push({
				coyote: 0,
				max: 4,
				check: function() {
					if(this.coyote >= this.max || ent.onfloor) {
						ent.canjump = false;
						return true;
					}
					this.coyote++;
				}
			});
		}
	};

	obj.lives = 3;

	obj.respawn = function() {
		this.x = 0;
		this.y = 0;

		this.life = this.maxlife;
		this.gunindex = 0;
		this.firetick = guns[this.gunindex].firerate;

		this.invincible = false;
		this.alive = true;

		//ents.length = 0;
	}

	// since this is called every time player dies, player doesnt get destroyed so we can reuse it :)
	// is this a bad practise?? idk... idc... too bad!
	obj.destroy = function() {
		if(this.lives <= 0) {
			world.title = true;
			return;
		}

		this.lives--;
		var ent = this;
		conds.pre.push({
			timer: 0,
			max: 50,
			check: function() {
				if(this.timer == this.max) {
					ent.respawn();
					return true;
				}
				this.timer++
			}
		});
		console.log(this.lives + ' lives left');
	};

	// reuse :)
	var entbedamaged = obj.constructor.prototype.bedamaged;

	obj.bedamaged = function() {

		var result = entbedamaged.apply(this,arguments);
		this.invincible = true;

		var ent = this;
		conds.pre.push({
			timer: 0,
			max: 20,
			check: function() {
				if(this.timer == this.max) {
					ent.invincible = false;
					return true;
				}
				this.timer++;
			}
		});

		return result;
	}

	return obj;
};