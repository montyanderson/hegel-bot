fetch('pos.txt')
.then(res => res.text())
.then(text => {

	const $code = document.querySelector('code');

	document.querySelector('button').addEventListener('click', () => {
		const lines = text.split('\n').slice(96)
			.map(line => line.trim())
			.filter(line => line.length > 60)
			.join(' ')
			.split('.')
			.map(line => line
				.trim()
				.split(/[^A-Za-z]/)
				.map(word =>
					word
						.trim()
						.toLowerCase()
						.replace(/[^0-9a-z]/gi, '')
				)
				.filter(word => !!word)
			);

		const dict = {};

		const END = Symbol();

		const startTerms = [];

		for(const line of lines) {
			startTerms.push([ line[0], line[1] ]);

			for(let i = 2; i < line.length; i++) {
				const key = JSON.stringify([ line[i - 2], line[i - 1 ]]);

				if(typeof dict[key] === 'undefined')
					dict[key] = [];

				dict[key].push(line[i]);
			}

			const key = JSON.stringify([ line[line.length - 2], line[line.length - 1 ]]);

			if(typeof dict[key] === 'undefined')
				dict[key] = [];

			dict[key].push(END);
		}

		function next(a, b) {
			const options = dict[JSON.stringify([ a, b ])];

			if(typeof options === 'undefined')
				return;

			return options[Math.floor(Math.random() * options.length)];
		}

		function complete(start) {
			for(;;) {
				const nextWord = next(start[start.length - 2], start[start.length - 1]);

				if(nextWord !== END) {
					start.push(nextWord);
				} else {
					return start;
				}
			}
		}

		function generate() {
			const sentence = [ ...startTerms[Math.floor(Math.random() * startTerms.length)] ];

			complete(sentence);

			return sentence.join(" ");
		}

		let output = "";

		while(output.length < 50) {
			output = generate();
		}

		$code.innerHTML = output;
	});
});
