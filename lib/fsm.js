var math = require('./math');

module.exports = {
  create: function() {
    return []
  },
  calculate: function(state) {
    var result = null;
    var operator = null;
    var acc = 0;
    for(let value of state) {
      if(typeof value === 'number') {
        acc *= 10;
        acc += value;
      } else { //operator
        if(result === null) {
          result = acc;
          acc = 0;
        } else {
          result = math.compute(result, operator, acc);
          acc = 0;
        }
        operator = value;
      }
      console.log("STATE", acc, operator, result);
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
