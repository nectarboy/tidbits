
class gun {
	constructor(name,color,velx,vely,accelx,accely,firerate,ammount,spread,reduce,damage,kb,size) {
		this.name = name;
		this.color = color;
	
		this.vel = {
			x: velx,
			y: vely
		};
		this.accel = {
			x: accelx,
			y: accely
		};
	
		this.firerate = firerate;
		this.ammount = ammount;
		this.spread = spread;
		this.reduce = reduce;
		this.damage = damage;
		this.kb = kb;
	
		this.size = size;
	}
}

gun.prototype.entityshoot = function(ent) {
	for(let i = 0; i < this.ammount; i++) {
		// prepare bullet
		var obj = new spawn.bullet(this,ent);
		ents.push(obj);
	}
	console.log(ent.name + ' fires their ' + this.name);
};


//// GUNS ////

var guns = [];

guns[0] = new gun('Crappy Wheelgun','#fff5db',3.9,0,0,0.01,11,1,0.2,24,16,1,2);
guns[1] = new gun('Wall Shotgun','#eec4ff',3,0,0,0,10,18,5,17,2,0.1,3);
guns[2] = new gun('Water Squirter','#0080ff',4,-1,0,0.1,4,2,0.5,10,2,0,3);
guns[3] = new gun('Heavy Rifle','#eba844',5.5,0,0,0.01,13,1,0.4,10,26,1.5,5);
guns[4] = new gun('Papa\'s Shotgun','#eba844',5.5,0,0,0,20,8,1.2,7,12,0.5,4);
guns[5] = new gun('Medium Ranger','#eba844',6,0,0,0,7,1,0,32,9,1,4);
guns[6] = new gun('Gramp\'s Sniper','#ffffff',7,0,0,0,30,1,0,15,100,3,7);
guns[7] = new gun('Assault Sprayer','#ffd970',5,0,0,0.01,4,1,0.4,28,5,0.7,3);
guns[8] = new gun('Boulder Gun','#6b665e',4,-5,0,0.3,26,1,0.5,3,45,5,25);
guns[9] = new gun('Flamethrower','#e67b1e',5,1,0,-0.3,1,1,2.5,4,4,0,6);