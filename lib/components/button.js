var React = require('react');
var classNames = require('classnames');
var {OPS, OPS_BY_SYMBOL} = require('../math');
require('./styles/button.scss');

module.exports = React.createClass({
  render: function() {
    var label = this.props.value;
    var classes = classNames('calc-button', {
      side: (label !== OPS.equal && OPS_BY_SYMBOL[label]) || label === 'del',
      del: label === 'del'
    });
    return (
      <button className={classes}
        onClick={this.handleClick}>
        {this.props.value}
      </button>
    )
  },
  handleClick: function(evt) {
    this.props.onClick(this.props.value);
  }
});
