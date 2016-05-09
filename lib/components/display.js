var React = require('react');
require('./styles/display.scss');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="calc-display">
        {this.props.value}
      </div>
    )
  }
});
