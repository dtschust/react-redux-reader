import _ from 'lodash';
import { createAction, createReducer } from 'redux-act';
import { apiFetchSubscriptions } from '../../feed-wrangler-api';

import { getAllFeedItems } from './feed-items-store';

export const updateSubscriptions = createAction('Update subscriptions');

export function fetchSubscriptions() {
	return (dispatch) => {
		apiFetchSubscriptions()
		.then((response) => {
			dispatch(updateSubscriptions(response.feeds));
		});
	}
}

const initialState = {};

export default createReducer({
	[updateSubscriptions]: (state, payload) => {
		return payload.reduce(
			(result, sub) => {
				result[sub.feed_id] = sub;
				return result;
			}, {}
		);
	}
}, initialState);

export function getAllSubscriptionIds(state) {
	return state && state.subscriptions && Object.keys(state.subscriptions);
}

export function getSubscriptionById(state, id) {
	return state && state.subscriptions && state.subscriptions[id];
}

export function getUnreadSubscriptionIds(state) {
	return _.uniq(_.map(_.filter(getAllFeedItems(state), { read: false }), 'feed_id'));
}