var React = require('react');
var Button = require('./button');
var Display = require('./display');
var Fsm = require ('../fsm');
require('./styles/display.scss');

module.exports = React.createClass({
  getInitialState: function() {
    return {output: " ", fsmState: Fsm.create()}
  },
  render: function() {
    return (
      <div className="calc">
        <Display value={this.state.output}></Display>
        <Button value={2} onClick={this.handleCommand}></Button>
      </div>
    )
  },
  handleCommand: function(command) {
    var {output, state: newFsmState} = Fsm.pushCommand(this.state.fsmState, command);
    this.setState({
      output: output || " ",
      fsmState: newFsmState
    });
  }
});
