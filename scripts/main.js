var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
// allows for html 5 push state
var createBrowserHistory = require('history/lib/createBrowserHistory');

var helpers = require('./helpers');

var App = React.createClass({
  render: function() {
    // pass in tagline as a prop to Header Component
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
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
        <h1>Catch
           <span className="ofThe">
             <span className="of">of</span>
             <span className="the">the</span>
           </span>
         Day</h1>
       <h3 className="tagline"><span>{this.props.tagline}</span></h3>
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

var StorePicker = React.createClass({
  render: function() {
    var name = 'Jane';

    return (
      <form className="store-selector">
        <p>Hi {name}.</p>
        <h2>Please enter a store</h2>
        <input type="text" ref="storeId" defaultValue={helpers.getFunName()} required />
        <input type="Submit" />
      </form>
    )
  }
});

var NotFound = React.createClass({
  render: function() {
    return <h1>Not Found</h1>
  }
})

// Routes

// Router decides which component to mount based on url
var routes = (
  // enbable html5 push state
  <Router history={createBrowserHistory()}>
    <Route path="/" component={StorePicker}/>
    <Route path="/store/:storeId" component={App}/>
    <Route path="*" component={NotFound}/>
  </Router>
)


// since React 1.4, to mount component on page, you need React DOM
// render(component, html element)

// pass routes to render.
ReactDOM.render(routes, document.querySelector('#main'));
