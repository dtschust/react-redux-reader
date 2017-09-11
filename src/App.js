import React, { Component } from 'react';
import { Provider } from 'react-redux';

import configureStore from './redux/configure-store';

import sync from './redux/sync';

import SubList from './components/sub-list';
import FeedList from './components/feed-list';
import StoryContainer from './components/story-container';

import './App.css';

const store = configureStore();

store.dispatch(sync());

class App extends Component {
	render() {
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
