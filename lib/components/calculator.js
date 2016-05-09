var React = require('react');
var Button = require('./button');
var Display = require('./display');
var Fsm = require ('../fsm');
var {OPS} = require('../math');
require('./styles/calculator.scss');

module.exports = React.createClass({
  getInitialState: function() {
    return {output: null, fsmState: Fsm.create()}
  },
  render: function() {
    var grid = [
      7, 8, 9, OPS.divide,
      4, 5, 6, OPS.multiply,
      1, 2, 3, OPS.subtract,
      'del', 0, OPS.equal, OPS.add
    ];
    var buttons = grid.map(item => {
      return (
        <Button value={item} onClick={this.handleCommand}></Button>
      );
    });
    return (
      <div className="calc">
        <Display value={this.state.output}></Display>
        {buttons}
      </div>
    )
  },
  handleCommand: function(command) {
    var {output, state: newFsmState} = Fsm.pushCommand(this.state.fsmState, command);
    this.setState({
      output: output,
      fsmState: newFsmState
    });
  }
});
