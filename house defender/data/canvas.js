
function truncate(num) {
	return num | 0;
}

var c = document.createElement('CANVAS');

c.width = 200;
c.height = 150;

c.style.width = c.width*4 + 'px';
c.style.height = c.height*4 + 'px';

var ctx = c.getContext('2d');

document.body.appendChild(c);