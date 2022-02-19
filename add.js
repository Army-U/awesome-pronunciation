const fs = require('fs');
const prettier = require('prettier');
const fetch = require('node-fetch');

const newWords = [
	'aggregate',
	'prompt',
	'delegation',
	'configurable',
];

const db = JSON.parse(
	fs
		.readFileSync('./db.json')
		.toString(),
);

newWords.forEach(
	async (word) => {
		let IPA = '';
		try {
			const data =
				await fetch(
					`https://dict.youdao.com/jsonapi_s?doctype=json&jsonversion=4&q=${word}&le=en&t=6&client=web&keyfrom=webdict`,
				).then((res) =>
					res.json(),
				);
			IPA =
				data.ec.word.usphone;
		} catch (e) {}

		const initial =
			word[0].toUpperCase();
		db[initial].unshift({
			word,
			origin: [
				`https://dict.youdao.com/dictvoice?audio=${word}&type=2`,
			],
			phonetic: [IPA],
			reference: '',
		});
	},
);

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
