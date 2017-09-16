import React, { Component } from 'react';
import { Provider } from 'react-redux';

import configureStore from './redux/configure-store';

import sync from './redux/sync';
import { updateTimestampNonce } from './redux/reducers/app-state-store';

import SubList from './components/sub-list';
import FeedList from './components/feed-list';
import StoryContainer from './components/story-container';
import LoginForm from './components/login-form';

import './App.css';

let store;
const ACCESS_TOKEN = localStorage.getItem('accessToken');

if (ACCESS_TOKEN) {
	store = configureStore();
	store.dispatch(sync());

	// Sync every five minutes
	setInterval(() => {
		store.dispatch(sync());
	}, 5 * 60 * 1000)
}

// Update timestamps every minute
setInterval(() => {
	store.dispatch(updateTimestampNonce());
}, 60 * 1000)

class App extends Component {
	render() {
		if (!ACCESS_TOKEN) {
			return <LoginForm/>
		}
		return (
			<Provider store={store}>
				<div id="app">
					<SubList />
					<FeedList />
					<StoryContainer />
				</div>
			</Provider>
		);
	}
}

export default App;
