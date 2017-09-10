import React, { Component } from 'react';
import { Provider } from 'react-redux';

import configureStore from './redux/configure-store';

import { fetchFeedItems } from './redux/reducers/feed-items-store';
import { fetchSubscriptions } from './redux/reducers/subscriptions-store';
import logo from './logo.svg';
import './App.css';

const store = configureStore();

store.dispatch(fetchFeedItems());
store.dispatch(fetchSubscriptions());

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React</h2>
          </div>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
      </Provider>
    );
  }
}

export default App;
