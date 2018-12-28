const fs = require('fs');

const text = fs.readFileSync(`${__dirname}/pos.txt`, 'utf8');

const lines = text.split('\n').slice(96)
	.map(line => line.trim())
	.filter(line => line.length > 60)
	.map(line => line.split(' ').map(word => word.toLowerCase()));

const dict = {};

for(const line of lines) {
	for(let i = 2; i < line.length; i++) {
		const key = JSON.stringify([ line[i - 2], line[i - 1 ]]);

		if(typeof dict[key] === 'undefined')
			dict[key] = [];

		dict[key].push(line[i]);
	}
}

function next(a, b) {
	const options = dict[JSON.stringify([ a, b ])];

	if(typeof options === 'undefined')
		return;

	return options[Math.floor(Math.random() * options.length)];
}

function complete(start, n) {
	for(let i = 0; i < n; i++) {
		const nextWord = next(start[start.length - 2], start[start.length - 1]);

		if(typeof nextWord === 'string') {
			start.push(nextWord);
		} else {
			return start;
		}
	}

	return start;
}


console.log(complete([ "volunteers", "and" ], 5));
