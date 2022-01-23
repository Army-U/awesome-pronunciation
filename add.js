const fs = require('fs');
const prettier = require('prettier');

const newWords = [
	'model',
	'modal',
];

const db = JSON.parse(
	fs
		.readFileSync('./db.json')
		.toString(),
);

newWords.forEach((word) => {
	const initial =
		word[0].toUpperCase();
	db[initial].unshift({
		word,
		origin: [
			`https://dict.youdao.com/dictvoice?audio=${word}&type=2`,
		],
		symbol: [''],
		reference: '',
	});
});

fs.writeFileSync(
	'./db.json',
	prettier.format(
		JSON.stringify(db),
		{
			useTabs: true,
			parser: 'json',
			printWidth: 30,
		},
	),
);
