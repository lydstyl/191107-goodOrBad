const fs = require('fs');
const brain = require('brain.js');

const settings = require('./settings.js');

console.log(`Tested word: ${settings.testWord}`);

for (let i = 0; i < 5; i++) {
  const lessons = {
    good: [],
    bad: []
  };

  function convertToLessons(data, goodOrBad) {
    lessons[goodOrBad] = data
      .split('\n')
      .map(sentense => ({ input: sentense, output: goodOrBad }));
  }

  function callBack1() {
    fs.readFile('bad.txt', 'utf8', function(err, data) {
      convertToLessons(data, 'bad');

      callBack2();
    });
  }

  function callBack2() {
    const lessonsForNet = lessons.good.concat(lessons.bad);

    const net = new brain.recurrent.LSTM();
    net.train(lessonsForNet, { iterations: settings.iterations, log: false });

    const output = net.run(settings.testWord);
    console.log(output);
  }

  fs.readFile('good.txt', 'utf8', function(err, data) {
    convertToLessons(data, 'good');

    callBack1();
  });
}
