
var world = {
	fps: 15,
	title: false
};

var player = spawn.player();

var tiles = [];
var ents = [];
var conds = {
	pre: [],
	post: []
};

var camera = {};

function titlescreen() {
	world.title = true;

	keymodule.removelisteners();

	ctx.fillStyle = '#111';
	ctx.fillRect(0 ,0, c.width, c.height);

	var startbutton = {};

	startbutton.w = 100;
	startbutton.h = 30;
	startbutton.x = c.width*0.5 - startbutton.w*0.5;
	startbutton.y = 50;

	ctx.fillStyle = '#eee';
	ctx.fillRect(startbutton.x, startbutton.y ,startbutton.w, startbutton.h);

	document.addEventListener('mousedown', checkbutton);

	function checkbutton(e) {
		var rect = c.getBoundingClientRect();

		var x = (e.clientX - rect.left)/4;
		var y = (e.clientY - rect.top)/4;

		if(x > startbutton.x && x < startbutton.x + startbutton.w &&
		y > startbutton.y && y < startbutton.y + startbutton.h) {
			document.removeEventListener('mousedown', checkbutton);
			// ...
			initializegame();
		}
	}

}

function initializegame() {
	console.log('start!');
	world.title = false;
	
	keymodule.addlisteners();

	/// reset game objects
	player = spawn.player();

	tiles.length = 0;
	ents.length = 0;
	conds.pre.length = 0;
	conds.post.length = 0;

	// camera
	camera = new spawn.camera;

	// spawn map
	map.spawn(0);

	conds.pre.push({
		timer: 0,
		max: 150,
		spread: 75,
		check: function() {
			if(this.timer >= this.max) {
				// init meteor
				var obj = new spawn.meteor
					(Math.random() * this.spread*2 + (player.x + player.w*0.5 - this.spread),-camera.y);
				obj.y -= obj.h;

				ents.push(obj);
				this.timer = 0;
			}
			this.timer++
		}
	});

	// initialize the loop
	loop();

}