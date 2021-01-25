const fs = require('fs');
const Path = require("path");
const config = require('./_config');

const minSuffix = (process.argv.slice(2).includes('-min')) ? '.min' : '';

const apiFilesMap = config.tables.reduce(
  (map, table) => {
    const fileDir = Path.resolve(__dirname, "./");
    const fileName = [`${table}${minSuffix}.json`, `${table}.json`]
    .find(fileName => fs.existsSync(`${fileDir}/${fileName}`));
    map[table] = `${fileDir}/${fileName}`;
    return map;
  }, {});
console.log('used files:', apiFilesMap);

let data = {};
for (const [table, file] of Object.entries(apiFilesMap) || {} ) {
  data[table] = require(file);
}

module.exports = () => {
  return data
};

