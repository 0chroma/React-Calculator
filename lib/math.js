var OPS = module.exports.OPS = {
  multiply: '\u00D7',
  divide: '\u00F7',
  add: '+',
  subtract: '-',
  equal: '='
};

var OPS_BY_SYMBOL = module.exports.OPS_BY_SYMBOL = {};
for(let key of Object.keys(OPS)){
  let value = OPS[key];
  OPS_BY_SYMBOL[value] = key;
}

module.exports.isOp = function(op) {
  return Object.keys(OPS_BY_SYMBOL).indexOf(op) !== -1;
}

module.exports.compute = function(lhs, operator, rhs) {
  var operation = OPS_BY_SYMBOL[operator];
  switch(operation) {
    case 'add':
      return lhs + rhs;
    case 'subtract':
      return lhs - rhs;
    case 'multiply':
      return lhs * rhs;
    case 'divide':
      return lhs / rhs;
  }
}
