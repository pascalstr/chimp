var Mocha = require('mocha'),
    fs    = require('fs'),
    path  = require('path'),
    exit  = require('exit'),
    ui    = require('./mocha-fiberized-ui');

var mochaOptions = {
  ui: 'fiberized-bdd-ui',
  timeout: process.env['chimp.mochaTimeout'],
  reporter: process.env['chimp.mochaReporter']
};

if (process.env['chimp.watch']) {
  mochaOptions.grep = new RegExp(process.env['chimp.watchTags'].replace(/,/g, '|'));
}

var mocha = new Mocha(mochaOptions);

mocha.addFile(path.join(path.resolve(__dirname, path.join('mocha-helper.js'))));

// Add each .js file to the mocha instance
var testDir = process.env['chimp.path'];
fs.readdirSync(testDir).filter(function (file) {
  // Only keep the .js files
  return file.substr(-3) === '.js';
}).forEach(function (file) {
  mocha.addFile(
    path.join(testDir, file)
  );
});

try {
// Run the tests.
  mocha.run(function (failures) {
    exit(failures);
  });
} catch (e) {
  throw(e);
}

