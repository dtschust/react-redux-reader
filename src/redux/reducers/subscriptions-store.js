import _ from 'lodash';
import { createAction, createReducer } from 'redux-act';
import { apiFetchSubscriptions } from '../../feed-wrangler-api';

import { getAllUnreadFeedItemIds, getFeedItem } from './feed-items-store';
import { getTagsForSub } from './taggings-store'

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
	return state && state.subscriptions && _.map(
		_.sortBy(
			_.filter(state.subscriptions, ({ feed_id }) => getTagsForSub(state, feed_id).length === 0),
			({title}) => title.toLowerCase()
		)
	, 'feed_id')
}

export function getSubscriptionById(state, id) {
	return state && state.subscriptions && state.subscriptions[id];
}

export function getTaggedSubscriptionIds(state) {
	return state && state.subscriptions &&
	_.groupBy(
		_.map(
			_.sortBy(
				_.filter(state.subscriptions, ({ feed_id }) => getTagsForSub(state, feed_id).length !== 0),
				({title}) => title.toLowerCase()
			)
		, 'feed_id')
	, (feed_id) => getTagsForSub(state, feed_id).length && getTagsForSub(state, feed_id)[0])
}

export function getTaggedUnreadSubscriptionIds(state) {
	const unreadSubscriptionIds = _.filter(_.uniq(getAllUnreadFeedItemIds(state).map((id) => {
		if (!getFeedItem(state,id)) {
			// TODO: What does it mean to have unread feed items but not have the content?
			return null;
		}
		return getFeedItem(state,id).feed_id
	})));
	return _.groupBy(
			_.sortBy(
				_.filter(unreadSubscriptionIds, (feed_id) => getTagsForSub(state, feed_id).length !== 0),
				(feed_id) => getSubscriptionById(state, feed_id).title.toLowerCase()
			)
	, (feed_id) => getTagsForSub(state, feed_id).length && getTagsForSub(state, feed_id)[0])
}

export function getUnreadSubscriptionIds(state) {
	const unreadSubscriptionIds = _.filter(_.uniq(getAllUnreadFeedItemIds(state).map((id) => {
		if (!getFeedItem(state,id)) {
			// TODO: What does it mean to have unread feed items but not have the content?
			return null;
		}
		return getFeedItem(state,id).feed_id
	})));
	return _.sortBy(_.filter(unreadSubscriptionIds, (feed_id) => getTagsForSub(state, feed_id).length === 0),
		(id) => _.get(getSubscriptionById(state, id), 'title', '').toLowerCase()
	);
}