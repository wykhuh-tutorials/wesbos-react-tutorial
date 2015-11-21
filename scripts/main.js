var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
  render: function() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header />
        </div>
        <Order />
        <Inventory />
      </div>
    )
  }
});

var Header = React.createClass({
  render: function() {
    return (
      <header className="top">
        <h1>Catch of the Day</h1>
      </header>
    )
  }
});

var Order = React.createClass({
  render: function() {
    return (
      <p>Order</p>
    )
  }
});


var Inventory = React.createClass({
  render: function() {
    return (
      <p>Inventory</p>
    )
  }
});

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
ReactDOM.render(<App />, document.querySelector('#main'));
