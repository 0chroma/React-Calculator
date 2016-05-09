var React = require('react');
require('./styles/button.scss');

module.exports = React.createClass({
  render: function() {
    return (
      <button className="calc-button" onClick={this.handleClick}>
        {this.props.value}
      </button>
    )
  },
  handleClick: function(evt) {
    this.props.onClick(this.props.value);
  }
});
