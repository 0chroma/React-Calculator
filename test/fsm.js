var test = require('tape');
var Fsm = require('../lib/fsm');
var {OPS} = require('../lib/math');

var testCommands = function(t, fsm, commands) {
  var acc = '';
  for(var command of commands) {
    acc += command;
    var {state: fsm, output} = Fsm.pushCommand(fsm, command);
    t.equal(output, acc);
  }
  return fsm
}

test('addition', function(t) {
  t.plan(6);
  var fsm = Fsm.create();
  fsm = testCommands(t, fsm, [1, 1, '+', 1, 1]);
  var {output} = Fsm.pushCommand(fsm, '=');
  t.equal(output, 22);
  t.end();
});

test('subtraction', function(t) {
  t.plan(4);
  var fsm = Fsm.create();
  fsm = testCommands(t, fsm, [2, OPS.multiply, 2]);
  var {output} = Fsm.pushCommand(fsm, '=');
  t.equal(output, 4);
  t.end();
});

test('multiplication', function(t) {
  t.plan(4);
  var fsm = Fsm.create();
  fsm = testCommands(t, fsm, [2, OPS.multiply, 2]);
  var {output} = Fsm.pushCommand(fsm, '=');
  t.equal(output, 4);
  t.end();
});

test('division', function(t) {
  t.plan(4);
  var fsm = Fsm.create();
  fsm = testCommands(t, fsm, [4, OPS.divide, 2]);
  var {output} = Fsm.pushCommand(fsm, '=');
  t.equal(output, 2);
  t.end();
});

test('decimal points (middle of number)', function(t) {
  t.plan(7);
  var fsm = Fsm.create();
  fsm = testCommands(t, fsm, [1, '.', 1, '+', 1, 1]);
  var {output} = Fsm.pushCommand(fsm, '=');
  t.equal(output, 12.1);
  t.end();
});

test('decimal points (starting with)', function(t) {
  t.plan(6);
  var fsm = Fsm.create();
  fsm = testCommands(t, fsm, ['.', 0, 2, '+', 2]);
  var {output} = Fsm.pushCommand(fsm, '=');
  t.equal(output, 2.02);
  t.end();
});

test('decimal points (rhs)', function(t) {
  t.plan(6);
  var fsm = Fsm.create();
  fsm = testCommands(t, fsm, [2, '+', 2, '.', 2]);
  var {output} = Fsm.pushCommand(fsm, '=');
  t.equal(output, 4.2);
  t.end();
});

test('decimal points (ignores multiple for one number)', function(t) {
  t.plan(2);
  var fsm = Fsm.create();
  for(let command of [2, '.', 2, '.', 2]) {
    var {state: fsm, output} = Fsm.pushCommand(fsm, command);
  }
  t.equal(output, '2.22');
  for(let command of ['+', 3, '.', 1, '.', 4]) {
    var {state: fsm, output} = Fsm.pushCommand(fsm, command);
  }
  t.equal(output, '2.22+3.14');
});

test('del commands', function(t) {
  t.plan(7);
  var fsm = Fsm.create();
  fsm = testCommands(t, fsm, [2, '+', 2, '.', 2]);
  var {output, state: fsm} = Fsm.pushCommand(fsm, 'del');
  t.equal(output, '2+2.');
  var {output} = Fsm.pushCommand(fsm, 'del');
  t.equal(output, '2+2');
  t.end();
});

test('use output as input for next calculation', function(t) {
  t.plan(4);
  var fsm = Fsm.create();
  fsm = testCommands(t, fsm, [2, '+', 2]);
  var {state: fsm} = Fsm.pushCommand(fsm, '=');
  var {state: fsm} = Fsm.pushCommand(fsm, '+');
  var {state: fsm} = Fsm.pushCommand(fsm, 4);
  var {output} = Fsm.pushCommand(fsm, '=');
  t.equal(output, 8);
  t.end();
});
