
function loop() {

	if(world.intitlescreen) {
		titlescreen();
		return
	}

	loop.update = function() {

		var updateCs = function(type) {
			for(let cs = 0; cs < type.length; cs++) {
				if(type[cs].check()) {
					type.splice(cs,1);
					cs--;
				}
			}
		};

		// pre-conditions
		updateCs(conds.pre);

		// entities
		player.update();
		for(let i = 0; i < ents.length; i++) {
			ents[i].update();
		}

		// post-conditions
		updateCs(conds.post);
	};

	loop.render = function() {

		var drawrect = function(rect) {
			if(rect.x < -camx - rect.w || rect.x > -camx + c.width)
				return true;
			ctx.fillStyle = rect.color;
			ctx.fillRect(Math.round(rect.x), Math.round(rect.y), rect.w, rect.h);
		}

		// adjust and set camera
		camera.adjust();
		ctx.save();
			var camx = truncate(camera.x);
			var camy = truncate(camera.y);
		ctx.translate(camx,camy);

		ctx.fillStyle = '#000';
		ctx.fillRect(-camx,-camy,c.width,c.height);

		// tiles
		for(let i = 0; i < tiles.length; i++) {
			drawrect(tiles[i]);
		}

		// entities
		for(let i = 0; i < ents.length; i++) {
			drawrect(ents[i]);
		}
		drawrect(player);

		ctx.restore();
		// gui...
	};

	loop.update();
	requestAnimationFrame(loop.render)

	setTimeout(loop,world.fps);

} titlescreen();