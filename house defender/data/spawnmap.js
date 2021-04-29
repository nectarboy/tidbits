
var map = {};
// used to spawn maps
map.spawn = function(index) {

	var arr = map[index]();
	console.log('spawned map ' + index);

	for(var i = 0; i < arr.length; i++) {
		// check if a 'tile' is an entity
		// BUGGED (wont push a completely new instance of object for WHATEVER FUCKING REASON. FUCK.)
		if(arr[i].constructor == entity) {
			console.log(arr[i]);
			ents.push(Object.create(arr[i]));
		} else {
			tiles.push(Object.create(arr[i]));
		}
	}

};

// 'debug'
map[0] = function() {
	return [
		new tile('blue',0,100,100,50,true,true,true,true),
		new tile('red',35,70,50,10,true,true,true,true),
		new tile('lime',-200,80,140,2,true,true,true,true),
		new tile('lime',-200,40,140,1,true,false,false,false)
	];
}