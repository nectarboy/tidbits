
function keymodule() {

	keymodule.keys = []; // checks current keys pressed

	keymodule.down = function(e) {
		// player controls...
		if(e.keyCode == 87 && !keymodule.keys[87] && player.alive) {
			conds.pre.push({
				coyote: 0,
				max: 5,
				check: function() {
					if(player.onfloor || player.canjump) {
						player.jump();
						return true;
					} else if(this.coyote == this.max)
						return true;
					this.coyote++;
				}
			});
		}

		keymodule.keys[e.keyCode] = true;

	};

	keymodule.up = function(e) {

		delete keymodule.keys[e.keyCode]; // delete it to save memory

	};

	// gets executed at game initialization
	keymodule.addlisteners = function() {
		document.addEventListener('keydown', keymodule.down);
		document.addEventListener('keyup', keymodule.up);
	};

	// gets executed at title screen
	keymodule.removelisteners = function() {
		document.removeEventListener('keydown', keymodule.down);
		document.removeEventListener('keyup', keymodule.up);
		keymodule.keys.length = 0;
	};

} keymodule();