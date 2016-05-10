var math = require('./math');

// Calculator finite state machine
module.exports = {
  // creates the state of the fsm (similar to a constructor)
  create: function() {
    return []
  },
  // builds a number out of a set of commands, ie [3, '.', 1, 4] would
  // return 3.14 as a floating point number
  _buildNumber: function(commands) {
    // accumulator for the number to return
    var acc = 0;
    // the location of the decimal point counting
    // from the right hand side
    var decimalIndex = 0;
    // flag for determining whether we should increment
    // decimalIndex on each iteration (1 for yes, 0 for no)
    var decimalIncrement = 0;

    for(let value of commands) {
      if(value == '.') {
        // we only want to start incrementing the decimal counter
        // if there's a decimal point, no other action is needed
        decimalIncrement = 1;
      } else {
        // if we're working with a number, that means there's another digit,
        // so we should shift what we already have over by a power of 10 and
        // add the value of the command to the 1's place
        // (can use += since it's guaranteed to be a single digit)
        acc *= 10;
        acc += value;
        decimalIndex += decimalIncrement; //increment the decimal point location if we saw one
      }
    }
    if(decimalIndex) {
      // if we saw a decimal place, we should divide
      // by 10 ^ (decimal's index)
      // For example, 3.14 would have acc=314 and decimalIndex=2,
      // 314 / (10 ^ 2) -> 314/100 -> 3.14
      return acc / Math.pow(10,  decimalIndex);
    } else {
      // if we didn't see a decimal place we can just return the
      // accumulator as it is
      return acc;
    }
  },
  // Calculates the output of a given fsm state.
  // There's no ordering of operations, just straight calculation from left to right.
  // (ie [2, '+', 2, '-', 1, '='] -> 3)
  calculate: function(state) {
    // keep an ongoing result, an accumulator for the current numeric value, and the last seen operator
    var result = null;
    var operator = null;
    var acc = [];
    for(let command of state) {
      // step through the list of commands, add each digit to the accumulator until we hit an operator
      if(typeof command === 'number' || command === '.') {
        acc.push(command);
      } else {
        // we hit an operator
        // if this is the first numeric value, put it directly into the ongoing result, and
        // note down the operator we ran into, since there's no current rhs to compute against yet.
        // Otherwise, there should be some intermediary result that we can compute against with the
        // previously noted operator.
        //
        // Something to note: the iteration in this loop is tricky in the sense that
        // it will ignore the last operator and rhs in the chain of commands.
        // This is okay though, since the last item in the state will always be an = operator,
        // thus there's no right hand side to calculate against or new result to compute in that case.
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
  // Concatinates a command to the fsm state if it's a valid command
  _concatCommand: function(state, command) {
    if(math.isOp(command)
        && (!state.length || math.isOp(state[state.length-1]))) {
      // this statement ensures that operations can only be added
      // if there's a number in front of it
      return state;
    }else if(command === '.') {
      // walk through the state backwards until we get to an op
      // or the beginning of the list, if we see a decimal point, bail out
      for(let i=state.length; i-- > 0;){
        if(state[i] === '.') {
          return state;
        } else if(math.isOp(state[i])) {
          break;
        }
      }
    }
    // since we made it up to here, the command should have been valid,
    // so concatinate the command onto the end of the state + return
    return state.concat(command);
  },
  // Pushes a command onto the fsm state and returns
  // both the new state, as well as the new user-facing output
  // after the command has been pushed.
  // ie: pushCommand(state, '2') -> {output: "2+2", state: [2, '+', 2]}
  pushCommand: function(state, command) {
    var ret = {};
    switch(command) {
      case math.OPS.equal:
        // = should always be the last item in the state,
        // so concat it and compute a result
        state = this._concatCommand(state, command);
        var result = this.calculate(state);
        ret.state = [result];
        ret.output = result;
        break;
      case 'del':
        // pop one item off of the state
        ret.state = state.slice(0, -1);
        break;
      default:
        // add the command (likely an operator, number or decimal point)
        ret.state = this._concatCommand(state, command);
        break;
    }
    // if output wasn't computed by some other branch in the switch
    // statement, compute it here by just joining the current state
    if(!ret.output) {
      ret.output = ret.state.join('');
    }
    return ret;
  }
}
