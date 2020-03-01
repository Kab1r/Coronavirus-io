const csvToJson = require('convert-csv-to-json');
 
const input = './coronavirus.csv'; 
const output = './public/coronavirus.json';
 
csvToJson.fieldDelimiter(',').formatValueByType().generateJsonFileFromCsv(input, output);
