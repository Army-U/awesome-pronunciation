const fs = require('fs');
const prettier = require('prettier');
const fetch = require('node-fetch');

// 加减乘除
// 和差积商
// 余
// 分子 分母
// 次方
// 个位数 十位数
const newWords = [
  'Integer',
  'decimal',
  'glitch',
  'collaborator',
  'division',
  'permutation',
  'diameter',
  'isomorphic',
  'n-ary',
  'intuition',
  'intuitive',
  'shuffle',
  'recursion',
  'indices',
  'palindrome',
  'numeral',
  'complexity',
  'allocate',
  'contiguous',
  'denote',
  'instantiated',
  'traversal',
  'symmetric',
  'peak',
  'valley',
  'outwards',
  'inwards',
  'forwards',
  'backwards',
  'initializes',
  'range',
  'linear',
  'pivot',
  'behavioral',
];

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
