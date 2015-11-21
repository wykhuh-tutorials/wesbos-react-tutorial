var React = require('react');
var ReactDOM = require('react-dom');

// Store picker component
var StorePicker = React.createClass({

  render: function() {
    var name = 'Jane';

    return (
      <form className="store-selector">
        <p>Hi {name}.</p>
        <h2>Please enter a store</h2>
        <input type="text" ref="storeId" required />
        <input type="Submit" />
      </form>
    )
  }

});

// since React 1.4, to mount component on page, you need React DOM
// render(component, html element)
ReactDOM.render(<StorePicker/>, document.querySelector('#main'));
