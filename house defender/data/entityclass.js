
class entity {
	constructor(name,color,x,y,w,h,life,damage,kb,selfkb,radius) {
		this.name = name;
		this.color = color;
	
		this.x = x;
		this.y = y;
	
		this.vel = {
			x: 0,
			y: 0
		};
	
		this.w = w;
		this.h = h;
	
		this.maxlife = life;
		this.life = this.maxlife;
		this.damage = damage;
		this.kb = {
			ammt: kb,
			self: selfkb
		};
	
		this.alive = true;
		this.moving = false;
		this.onfloor = false;
		this.lookingright = true;
		this.invincible = false;
	}
}

entity.prototype.shrink = function(ammt = 1) {
	this.w -= ammt;
	this.h -= ammt;
	this.x += ammt*0.5;
	this.y += ammt*0.5;
}

entity.prototype.destroy = function() {
	var ent = this;
	conds.post.push({
		check: function() {
			ents.splice(ents.indexOf(ent),1);
			return true;
		}
	});
}

entity.prototype.bedamaged = function(attacker) {
	if(!attacker.alive || this.invincible)
		return false;
	// damage
	var damage = Math.round(Math.random() * 2 + attacker.damage - 1);
	if(damage < 1)
		damage = 1;

	// knockback
	var kb = attacker.kb.ammt;
	var selfkb = -attacker.kb.self;
	if(!attacker.lookingright) {
		kb = -kb;
		selfkb = -selfkb;
	}

	attacker.vel.x = attacker.vel.x + selfkb;

	this.vel.x = this.vel.x + kb;
	if(this.onfloor)
		this.vel.y = -2;

	if(!this.alive)
		return false;
	this.life = this.life - damage;
	console.log(this.name + ' life - ' + damage + 'dmg, life: ' + this.life);
	if(this.life <= 0) {
		this.die();
		return true;
	}

	return false;
};

entity.prototype.jump = function() {
	if(!this.onfloor && !this.canjump) {
		return false;
	}

	this.vel.y = this.jumpvalue;
	this.canjump = false;

	return true;
};

entity.prototype.die = function() {
	// not alive no more
	this.alive = false;
	this.life = 0;
	console.log(this.name + ' died');
	this.destroy();
};

entity.prototype.sinkany = function(obj) {
	return (this.x > obj.x - this.w && this.x < obj.x + obj.w &&
	this.y > obj.y && this.y < obj.y + obj.h);
};

entity.prototype.collideany = function(obj) {
	return (this.x > obj.x - this.w && this.x < obj.x + obj.w &&
	this.y > obj.y - this.h && this.y < obj.y + obj.h);
};

entity.prototype.collidetiles = function() {
	// entity is not on ground by default
	this.onfloor = false;
	// do the magic
	for(let i = 0; i < tiles.length; i++) {
		tiles[i].collision(this);
	}
};