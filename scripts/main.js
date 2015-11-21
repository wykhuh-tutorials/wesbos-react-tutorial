var React = require('react');
var ReactDOM = require('react-dom');

// Store picker component
var StorePicker = React.createClass({

  render: function() {
    return (
      <p>hello</p>
    )
  }

});

// since React 1.4, to mount component on page, you need React DOM
// render(component, html element)
ReactDOM.render(<StorePicker/>, document.querySelector('#main'));
