import _ from 'lodash';
import { createAction, createReducer } from 'redux-act';
import { apiFetchSubscriptions } from '../../feed-wrangler-api';

import { getAllUnreadFeedItemIds, getFeedItem } from './feed-items-store';

export const updateSubscriptions = createAction('Update subscriptions');

export function fetchSubscriptions() {
	return (dispatch) => {
		return apiFetchSubscriptions()
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
	return state && state.subscriptions && _.map(_.sortBy(state.subscriptions, ({title}) => title.toLowerCase()), 'feed_id')
}

export function getSubscriptionById(state, id) {
	return state && state.subscriptions && state.subscriptions[id];
}

export function getUnreadSubscriptionIds(state) {
	const unreadSubscriptionIds = _.filter(_.uniq(getAllUnreadFeedItemIds(state).map((id) => {
		if (!getFeedItem(state,id)) {
			// TODO: What does it mean to have unread feed items but not have the content?
			return null;
		}
		return getFeedItem(state,id).feed_id
	})));
	return _.sortBy(unreadSubscriptionIds, (id) => _.get(getSubscriptionById(state, id), 'title', '').toLowerCase());
}