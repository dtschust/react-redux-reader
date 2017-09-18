import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist'

import ReduxThunk from 'redux-thunk';

import reducer from './root-reducer';

export default function configureStore(postHydrateCb) {
	const middleware = [ ReduxThunk ];
	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	const store = createStore(reducer, composeEnhancers(
		applyMiddleware(...middleware),
		autoRehydrate(),
	));

	persistStore(store, undefined, postHydrateCb);

	return store;
}