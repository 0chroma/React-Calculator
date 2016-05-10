var math = require('./math');

module.exports = {
  create: function() {
    return []
  },
  _buildNumber: function(commands) {
    var acc = 0;
    var decimalIndex = 0;
    var decimalIncrement = 0;
    for(let value of commands) {
      if(value == '.') {
        decimalIncrement = 1;
      } else {
        acc *= 10;
        acc += value;
        decimalIndex += decimalIncrement;
      }
    }
    if(decimalIndex) {
      return acc / (10 * decimalIndex);
    } else {
      return acc;
    }
  },
  calculate: function(state) {
    var result = null;
    var operator = null;
    var acc = [];
    for(let command of state) {
      if(typeof command === 'number') {
        acc.push(command);
      } else if(command === '.' && acc.indexOf('.') === -1) {
        acc.push(command);
      } else { //operator
        var number = this._buildNumber(acc);
        acc = [];
        if(result === null) {
          result = number;
        } else {
          result = math.compute(result, operator, number);
        }
        operator = command;
      }
    }
    return result;
  },
  _concatCommand: function(state, command) {
    if(math.isOp(command)
        && (!state.length || math.isOp(state[state.length-1]))) {
      return state;
    }
    return state.concat(command); //valid
  },
  pushCommand: function(state, command) {
    var ret = {};
    switch(command) {
      case '=':
        state = this._concatCommand(state, command);
        var result = this.calculate(state);
        ret.state = [result];
        ret.output = result;
        break;
      case 'del':
        ret.state = state.slice(0, -1);
        break;
      default:
        ret.state = this._concatCommand(state, command);
        break;
    }
    if(!ret.output) {
      ret.output = ret.state.join('');
    }
    return ret;
  }
}
