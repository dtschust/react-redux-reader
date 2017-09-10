import React, { Component } from 'react';
import { Provider } from 'react-redux';

import configureStore from './redux/configure-store';

import { fetchFeedItems } from './redux/reducers/feed-items-store';
import { fetchSubscriptions } from './redux/reducers/subscriptions-store';

import SubList from './components/sub-list';

import logo from './logo.svg';
import './App.css';

const store = configureStore();

store.dispatch(fetchFeedItems());
store.dispatch(fetchSubscriptions());

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <SubList />
      </Provider>
    );
  }
}

export default App;
