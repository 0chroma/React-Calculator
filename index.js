var React = require('react');
var ReactDOM = require('react-dom');
var Button = require('./lib/components/button');
var Display = require('./lib/components/display');

var clickHandler = () => alert('hi!');
var body = (
  <div>
    <h1>Calculator</h1>
    <Display value="2 + 2"></Display>
    <Button value={2} onClick={clickHandler}></Button>
  </div>
)
ReactDOM.render(body, document.getElementById('root'));
