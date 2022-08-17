const fs = require('fs');
const prettier = require('prettier');
const fetch = require('node-fetch');

const newWords = ['debt', 'next', 'Vite'];

const db = JSON.parse(fs.readFileSync('./db.json').toString());

const p = newWords.map(async (word) => {
  let IPA = '';
  try {
    const data = await fetch(
      `https://dict.youdao.com/jsonapi_s?doctype=json&jsonversion=4&q=${word}&le=en&t=6&client=web&keyfrom=webdict`,
    ).then((res) => res.json());
    try {
      IPA = `[${data.ec.word.usphone}]`;
    } catch (e) {
      console.log(`${word} not found`);
    }
  } catch (e) {
    console.log('download error', e.message);
  }

  const initial = word[0].toUpperCase();
  db[initial].unshift({
    word,
    origin: [`https://dict.youdao.com/dictvoice?audio=${word}&type=2`],
    phonetic: [IPA || ''],
    reference: '',
  });
});

Promise.all(p).then(() => {
  console.log(JSON.stringify(db));

  fs.writeFileSync(
    './db.json',
    prettier.format(JSON.stringify(db), {
      useTabs: true,
      parser: 'json',
      printWidth: 30,
    }),
  );
});
