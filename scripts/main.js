var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History;
// allows for html5 push state
var createBrowserHistory = require('history/lib/createBrowserHistory');

var helpers = require('./helpers');
// Firebase
var Rebase = require('re-base');
// hook up to firebase. base is the reference to firebase.
var base = Rebase.createClass('https://react-fish-huh.firebaseio.com/');


var App = React.createClass({
  // getInitialState is part of React life cycle.
  // React will execute getInitialState and populate the state before the
  // component is created.
  getInitialState: function() {
    return {
      fishes: {},
      order: {}
    }
  },

  // componentDidMount is part of React life cycle.
  // occurs once after component is rendered
  componentDidMount: function() {
    // Rebase syncState() will sync App state with Firebase

    // syncState params are
    // 1. 'store slug/fishes'
    //  2. object with context and state

    // firebase will turn 'slug/fishes' and state:fishes into
    //  { slug:
    //    { fishes:
    //      { fish1: {}},
    //      { fish2: {}},
    //     }
    //   }
    base.syncState(
      this.props.params.storeId + '/fishes',
      // 'this' refer to App compontent
      { context: this, state: 'fishes'}
    );
  },

  // componentWillUpdate is part of React life cycle.
  // occurs when prop or state chamges
  componentWillUpdate: function(nextProps, nextState) {
    console.log('next', nextState)
    // get store id from react router using this.props.params
    // local storage: key, value  as json
    localStorage.setItem(
      'order-' + this.props.params.storeId,
       JSON.stringify(nextState.order)
     )
  },

  // add one order to App state
  addToOrder: function(key) {
    // set to 1 or increment by one
    this.state.order[key] = this.state.order[key] + 1 || 1;

    this.setState({ order: this.state.order });
  },

  // add one fish to App state
  addFish: function(fish) {
    // give each fish a unique key
    var timestamp = Date.now();

    // update the state object
    this.state.fishes['fish-' + timestamp] = fish;

    // set the state

    // look up the fishes property in the existing state. Set existing fishes
    // to the new fishes state.
    this.setState({ fishes: this.state.fishes });
  },

  // add all sample data to App state
  loadSamples: function() {
    this.setState({
      fishes: require('./sample-fishes')
    })
  },

  // render a fish from App state
  renderFish: function(key) {
    // when you render a component, the component must have a key property with
    // a unique key. When there is a change to a particular element, React knows
    // which component to re-render.

    // we can't access key property inside the component, so we have to create
    // an index property to access the unique key value
    return <Fish key={key} index={key} details={this.state.fishes[key]}
      addToOrder={this.addToOrder} />
  },

  render: function() {
    // pass in tagline as a prop to Header Component

    // pass addFish() as prop to Inventory

    // fishes is a object. map only works on array.
    // Object.keys returns array that we can use map on.
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order}/>
        <Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
      </div>
    )
  }
});

var Fish = React.createClass({
  onButtonClick: function() {
    this.props.addToOrder(this.props.index);
  },
  render: function() {
    var details = this.props.details;
    var isAvailable = (details.status === 'available'? true : false);
    var buttonText = (isAvailable ? 'Add To Order' : 'Sold Out!')
    return (
      <li className="menu-fish">
        <img src={details.image} alt={details.name} />
        <h3 className="fish-name">
          {details.name}
          <span className="price">{helpers.formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
      </li>
    )
  }
});

var AddFishForm = React.createClass({
  createFish: function(event) {
    event.preventDefault();

    // take data from form and create fish object
    var fish = {
      name: this.refs.name.value,
      price: this.refs.price.value,
      status: this.refs.status.value,
      desc: this.refs.desc.value,
      image: this.refs.image.value,
    }
    console.log(fish)

    // add fish to App state

    // addFish is defined in <App />. We pass down addFish as prop from
    // Inventory -> AddFishForm.
    this.props.addFish(fish);

    // clears the form
    this.refs.fishForm.reset();
  },
  render: function() {
    return (
      <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
        <input type="text" ref="name" placeholder="Fish Name"/>
        <input type="text" ref="price" placeholder="Fish Price" />
        <select ref="status">
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" ref="desc" placeholder="Desc"></textarea>
        <input type="text" ref="image" placeholder="URL to Image" />
        <button type="submit">+ Add Item </button>
      </form>
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
  renderOrder: function(key) {
    var fish = this.props.fishes[key];
    var count = this.props.order[key];

    if(!fish) {
      return <li key={key}>Sorry, fish no longer available!</li>
    }
    return (
      <li key={key}>
        {count} lbs
        {fish.name}
        <span className="price">{helpers.formatPrice(count * fish.price)}</span>
      </li>
    )
  },
  render: function() {
    var orderIds = Object.keys(this.props.order);

    var total = orderIds.reduce((prevTotal, key) => {
      var fish = this.props.fishes[key];
      var count = this.props.order[key];
      var isAvailable = fish && fish.status === 'available';
      if (fish && isAvailable) {
        return prevTotal + (count * parseInt(fish.price) || 0);
      }
      return prevTotal;
    }, 0);

    return (
      <div className="order-wrap">
        <h2 className="order-title">Your Order</h2>
        <ul className="order">
          {orderIds.map(this.renderOrder)}

          <li className="total">
            <strong>Total:</strong>
            {helpers.formatPrice(total)}
          </li>
        </ul>
      </div>
    )
  }
});


var Inventory = React.createClass({
  // instead of writing each prop, we can use {..this.props} to pass all props.

  // pass all the props from Inventory to AddFishForm.
  // addFish is the only prop on Inventory.
  render: function() {
    return (
      <div>
        <h2>Inventory</h2>
        <AddFishForm {...this.props} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }
});

var StorePicker = React.createClass({
  // have to specifiy mixins such has History for an component
  mixins: [History],

  goToStore: function(event) {
    // prevent form from submitting and refreshing the page
    event.preventDefault();
    // get data from input

    // <input type="text" ref="storeId" ...>
    // this.refs.storeId refers to the element whose ref = "storeId"

    // this.refs.storeId is on object with lots of js and React properties
    var storeId = this.refs.storeId.value;
    console.log(storeId);

    // transition from StorePicker to App
    this.history.pushState(null, '/store/' + storeId);
  },

  render: function() {
    var name = 'Jane';
    // 'this' refers to the component.
    // when the form is submitted, do callback

    // ref allows us to refer to the element from inside the component
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
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
