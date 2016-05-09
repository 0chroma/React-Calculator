var test = require('tape');
var Fsm = require('../lib/fsm');

test('basic operations', function(t) {
  var fsm = Fsm.create();
  var acc = '';
  for(var command of [1, '+', 1]) {
    acc += command;
    var {state: fsm, output} = Fsm.pushCommand(fsm, command);
    t.equal(output, acc);
  }
  var {output} = Fsm.pushCommand(fsm, '=');
  t.equal(output, 2);
  t.end();
});
