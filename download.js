const fs = require('fs');
const http = require('http');
const https = require('https');

const DB_NAME = './db.json';
const ALPHABET =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZ_';
const HTTP = 'http://';
const HTTPS = 'https://';

/**
 * download audios
 */
function download() {
	const data = JSON.parse(
		fs.readFileSync(DB_NAME),
	);
	for (const i of ALPHABET) {
		const wordList = data[i];
		downloadLetter(wordList);
	}
}

/**
 * download single letter audios
 * @param {List} wordList
 */
function downloadLetter(
	wordList,
) {
	for (const j of wordList) {
		if (
			!j.origin ||
			j.origin.length === 0 ||
			j.explanation
		) {
			continue;
		}
		for (const index in j.origin) {
			let filepath = '';
			if (
				j.origin.length === 1
			) {
				filepath = `./docs2/public/audio/${(
					j.key || j.word
				).replace(
					'.',
					'dot-',
				)}.mp3`;
			} else {
				filepath = `./docs2/public/audio/${(
					j.key || j.word
				).replace(
					'.',
					'dot-',
				)}-${index}.mp3`;
			}
			if (
				!isFileExist(filepath)
			) {
				const file =
					fs.createWriteStream(
						filepath,
					);
				if (
					j.origin[
						index
					].includes(HTTP)
				) {
					http
						.get(
							j.origin[index],
							function (
								response,
							) {
								response.pipe(
									file,
								);
								console.log(
									filepath +
										' has downloaded!',
								);
							},
						)
						.on(
							'error',
							() => {
								console.log(
									j.origin[
										index
									],
								);
							},
						);
				} else if (
					j.origin[
						index
					].includes(HTTPS)
				) {
					https
						.get(
							j.origin[index],
							function (
								response,
							) {
								response.pipe(
									file,
								);
								console.log(
									filepath +
										' has downloaded!',
								);
							},
						)
						.on(
							'error',
							() => {
								console.log(
									j.origin[
										index
									],
								);
							},
						);
				}
			}
		}
	}
}

/**
 * whether the file exists
 * @param {String} path
 */
function isFileExist(path) {
	try {
		fs.accessSync(
			path,
			fs.F_OK,
		);
	} catch (e) {
		return false;
	}
	return true;
}

const options = process.argv;
download();
