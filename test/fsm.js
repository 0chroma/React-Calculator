var test = require('tape');
var Fsm = require('../lib/fsm');

test('basic operations', function(t) {
  t.plan(6);
  var fsm = Fsm.create();
  var acc = '';
  for(var command of [1, 1, '+', 1, 1]) {
    acc += command;
    var {state: fsm, output} = Fsm.pushCommand(fsm, command);
    t.equal(output, acc);
  }
  var {output} = Fsm.pushCommand(fsm, '=');
  t.equal(output, 22);
  t.end();
});

test('decimal points', function(t) {
  t.plan(7);
  var fsm = Fsm.create();
  var acc = '';
  for(var command of [1, '.', 1, '+', 1, 1]) {
    acc += command;
    var {state: fsm, output} = Fsm.pushCommand(fsm, command);
    t.equal(output, acc);
  }
  var {output} = Fsm.pushCommand(fsm, '=');
  t.equal(output, 12.1);
  t.end();
});
