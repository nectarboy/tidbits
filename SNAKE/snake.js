(function () { "use strict"

	var isEven = function (n) {

		return (n % 2 == 0);

	};

	// CANVAS //

	var CANVAS = document.createElement ('CANVAS');
	var CTX = CANVAS.getContext ('2d');

	document.body.appendChild (CANVAS);

	var colors = {

		BACKGROUND: '#000',

		SNAKE: '#0cff00',

		2: '#dd0d80', // berry

		1: '#fff' // wall

	};

	// MAP //

	var MAP_W = 16;

	CANVAS.width = CANVAS.height = MAP_W;

	var MAP = [

		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,

	];

	var MAP_COL = {

		1: function (snake) {

			GAMEOVER ();

		},

		2: function (snake) {

			snake.EATBERRY ();

		}

	};

	var GENERATEBERRY = function () {

		var ind = Math.floor (Math.random () * (MAP_W * MAP_W));

		// failsafe
		while (MAP [ind])
			ind --;

		MAP [ind] = 2; // berry

	};

	var GAMEOVER = function () {

		location.reload ();

	};

	GENERATEBERRY ();

	// SNAKE //
	
	var Snake = function (x,y) {

		this.x = this.y = Math.floor (MAP_W * 0.5);

		this.segments = [this.y * MAP_W + x];

		// controls //

		this.dirs = {

			0: {
				x: 1,
				y: 0
			},
			2: {
				x: -1,
				y: 0
			},

			1: {
				x: 0,
				y: 1
			},
			3: {
				x: 0,
				y: -1
			},

		};

		this.dirpointer = 0;

		// functions //

		this.UPDATE = function () {

			var ctrldir = controller.dirs;

			if (ctrldir.length) {

				if (

					(isEven (ctrldir [0]) && !isEven (this.dirpointer)) ||

					(!isEven (ctrldir [0]) && isEven (this.dirpointer))

				)
					this.dirpointer = ctrldir [0];

				ctrldir.shift ();

			}

			var moveset = this.dirs [this.dirpointer];

			this.MOVE (moveset.x, moveset.y);

		}

		this.MOVE = function (x,y) {

			// segments //

			this.segments.pop ();

			this.x += x;
			this.y += y;

			if (this.x >= MAP_W)
				this.x = 0;

			else if (this.x < 0)
				this.x = MAP_W - 1;

			if (this.y >= MAP_W)
				this.y = 0;

			else if (this.y < 0)
				this.y = MAP_W - 1;

			this.segments.unshift (this.y * MAP_W + this.x);

			// check if hitting self

			for (var i = this.segments.length - 1; i > 0; i --) {

				if (this.segments [0] == this.segments [i])
					GAMEOVER ();

			}

			// collision //

			var mapcol = MAP_COL [MAP [this.segments [0]]];

			if (mapcol)
				mapcol (this);

		};

		this.EATBERRY = function () {

			MAP [this.segments [0]] = 0; // berry gone

			this.segments.push (undefined);

			console.log (this.segments.length);

			GENERATEBERRY ();

		}

	};

	var snake = new Snake ();

	// CONTROLS //

	var controller = function () {

		var ctrl = controller; // short

		ctrl.dirs = [];
		ctrl.firing = {};

		ctrl.down = function (e) {

			if (ctrl.firing [e.code])
				return;

			ctrl.firing [e.code] = true;

			var dir;

			switch (e.code) {

				case 'KeyD':
					dir = 0;
					break;

				case 'KeyA':
					dir = 2;
					break;

				case 'KeyS':
					dir = 1;
					break;

				case 'KeyW':
					dir = 3;
					break;

				default:
					return;
					break;

			}

			ctrl.dirs.push (dir);

		};

		ctrl.up = function (e) {

			delete ctrl.firing [e.code];

		};

		document.addEventListener ('keydown', ctrl.down);
		document.addEventListener ('keyup', ctrl.up);

	};

	controller ();

	// LOOP //

	var MS = 100;

	// EASY		200
	// MEDIUM	150
	// HARD		100

	var LOOP = function () {

		snake.UPDATE ();

		// rendering //

		CTX.fillStyle = colors.BACKGROUND;
		CTX.fillRect (

			0,
			0,

			CANVAS.width,
			CANVAS.height

		);

		// snake //

		CTX.fillStyle = colors.SNAKE;

		for (let i = 0; i < snake.segments.length; i ++) {

			var seg = snake.segments [i];

			var x = seg;
			var y = 0;

			while (x >= MAP_W) {

				x -= MAP_W;
				y ++;

			}

			CTX.fillRect (

				x,
				y,

				1,
				1

			);

		}

		var x = 0;
		var y = 0;

		for (var i = 0; i < MAP.length; i ++) {

			if (x >= MAP_W) {

				x = 0;
				y ++;

			}

			var color = colors [MAP [i]];

			if (color) {

				CTX.fillStyle = color;

				CTX.fillRect (

					x,
					y,

					1,
					1

				);

			}

			x ++;

		}

		// loop //

		setTimeout (LOOP, MS);

	};

	LOOP ();

}) ();