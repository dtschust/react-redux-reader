import { combineReducers } from 'redux';

import appState from './reducers/app-state-store';
import feedItems from './reducers/feed-items-store';
import unreadItems from './reducers/unread-items-store';
import subscriptions from './reducers/subscriptions-store';
import pendingCleanup from './reducers/pending-cleanup-store';

export default combineReducers({
	appState,
	feedItems,
	unreadItems,
	subscriptions,
	pendingCleanup,
});
