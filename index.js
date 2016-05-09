var React = require('react');
var ReactDOM = require('react-dom');
var Calculator = require('./lib/components/calculator');

var clickHandler = () => alert('hi!');
var body = (
  <div>
    <h1>Calculator</h1>
    <Calculator></Calculator>
  </div>
)
ReactDOM.render(body, document.getElementById('root'));
