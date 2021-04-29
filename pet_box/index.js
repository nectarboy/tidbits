const GameClient = class {

	constructor () {

		let game = this; // reference

		// CANVAS //

		this.canv = {};

			this.canv.obj = document.createElement ('CANVAS');

				this.canv.obj.width = 400;
				this.canv.obj.height = 300;

				document.getElementById ('canvasDiv').appendChild (this.canv.obj); // Append canvas to canvas div

			this.canv.ctx = this.canv.obj.getContext ('2d');

				this.canv.render = function () {

					this.ctx.fillStyle = this.bgcolor;

					this.ctx.fillRect (0,0, this.obj.width,this.obj.height);

				};

			this.canv.bgcolor = '#92dee5';

		// MASTER //

		this.master = {

			x: 10,
			y: 0,

			clicking: false,

			ropecolor: '#b23a4c',

			start: function () {

				document.addEventListener ('mousemove', this.track);

				document.addEventListener ('mousedown', this.toggleClick);
				document.addEventListener ('mouseup', this.toggleClick);

			},

			kill: function () {

				document.removeEventListener ('mousemove', this.track);

				document.removeEventListener ('mousedown', this.toggleClick);
				document.removeEventListener ('mouseup', this.toggleClick);

			}

		};

		{

			let m = this.master;

			m.toggleClick = function () {

				return m.clicking = !m.clicking;

			};

			m.track = function (e) {

				let rect = game.canv.obj.getBoundingClientRect ();

				var scalex = game.canv.obj.width / rect.width;
				var scaley = game.canv.obj.height / rect.height;

				console.log 

				m.x = (e.clientX - rect.left) * scalex;
				m.y = (e.clientY - rect.top) * scaley;

			};

		};

		this.master.start ();

		// PET BOX //

		this.PetBox = class {

			constructor () {

				this.x = 0;
				this.y = 0;

				this.vx = 0;
				this.vy = 0;

				this.accy = 0.3;

				this.grounded = false;

				this.w = 20;
				this.h = 15;

				this.color = '#9514e0';

				// rope

				this.maxrope = 100;

				this.ropetight = 0.005; // 0 - 1

			}

			bounceX () {

				this.vx = -this.vx * 0.5;

			}
			bounceY () {

				this.vy = -this.vy * 0.5;

			}

			update () {

				// velocity //

				this.vy = this.vy + this.accy;

				if (this.grounded)
					this.vx = this.vx * 0.9;

				let m = game.master;

				if (m.clicking) {

					let tx = (m.x - this.x - this.w * 0.5);
					let ty = (m.y - this.y - this.h * 0.5);

					let atx = Math.abs (tx);
					let aty = Math.abs (ty);

					if (atx + aty > this.maxrope) {

						this.vx += (tx) * this.ropetight;

						this.vy += (ty) * this.ropetight;

					}

				}

				// position

				this.x = this.x + this.vx;
				this.y = this.y + this.vy;

				// collision //

				let top = game.canv.obj.height - this.h;
				let edge = game.canv.obj.width - this.w;

				if (this.y > top) {

					this.y = top;
					this.bounceY ();

					this.grounded = true;

				}
				else
					this.grounded = false;

				if (this.x > edge) {

					this.x = edge;
					this.bounceX ();

				}
				else if (this.x < 0) {

					this.x = 0;
					this.bounceX ();

				}

			}

			render () {

				let c = game.canv;

				// rope

				let m = game.master;

				if (m.clicking) {

					c.ctx.strokeStyle = m.ropecolor;

					c.ctx.beginPath();

					c.ctx.moveTo (this.x + this.w * 0.5,this.y + this.h * 0.5);
					c.ctx.lineTo (m.x,m.y);

					c.ctx.stroke();

				}

				// pet

				c.ctx.fillStyle = this.color;

				c.ctx.fillRect (this.x,this.y, this.w,this.h);

			}

		};

		this.pets = [];

		this.pets.add = function () {

			let pet = new game.PetBox ();

				pet.color
					= '#' + ('00000' + Math.round (Math.random () * 0xffffff).toString (16)) // Random hex num
					.slice (-6); // Make sure there are 0s

				pet.x = Math.random () * game.canv.obj.width;

				pet.w = Math.random () * 10 + pet.w;
				pet.h = Math.random () * 10 + pet.h;

			this.push (pet);

		};

		let petcount = prompt ('how many pets would you like?');

		for (let i = 0; i < petcount; i++)
			this.pets.add ();


	}

	// METHODS //

	Update () {

		// PETS //

		for (let i = 0; i < this.pets.length; i++) {

			this.pets[i].update ();

		}

	}

	Render () {

		// BACKGROUND //

		this.canv.render ();

		// PETS //

		for (let i = 0; i < this.pets.length; i++) {

			this.pets[i].render ();

		}

	}

	Iterate () {

		this.Update ();

		this.Render ();

	}

	Loop () {

		this.Iterate ();

		let game = this;

		setTimeout (function () {

			game.Loop ();

		}, 16);

	}

};

let game = new GameClient ();

game.Loop ();