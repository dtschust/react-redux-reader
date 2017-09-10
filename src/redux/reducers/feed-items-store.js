import _ from 'lodash';
import { createAction, createReducer } from 'redux-act';
import sanitizeHtml from 'sanitize-html';

import { apiFetchFeedItems, apiUpdateFeedItem } from '../../feed-wrangler-api';
import { getShowFilter, SHOW_UNREAD, ALL_SUBSCRIPTION } from './app-state-store';

export const addFeedItems = createAction('Add feed items');
export const updateReadStatus = createAction('Update the read status of an item by id');

export function fetchFeedItems(limit, offset, feedId) {
	return (dispatch, getState) => {
		const read = getShowFilter(getState()) === SHOW_UNREAD ?
			false :
			undefined;
		const options = {
			feedId,
			read,
		}
		apiFetchFeedItems(limit, offset, options)
		.then((response) => {
			dispatch(addFeedItems(response.feed_items));
		});
	}
}

export function setReadStatus(id, read) {
	return (dispatch) => {
		apiUpdateFeedItem(id, { read }).then(({ result } = {}) => {
			if (result === 'success') {
				dispatch(updateReadStatus({ id, read }));
			}
		});
	}
}

const initialState = {};

export default createReducer({
	[addFeedItems]: (state, payload) => {
		const updates = payload.reduce(
			(result, feedItem) => {
				result[feedItem.feed_item_id] = {
					...feedItem,
					body: sanitizeHtml(feedItem.body, {allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])}),
				};
				return result;
			}, {}
		);
		return {
			...state,
			...updates,
		}
	},
	[updateReadStatus]: (state, { id, read } = {}) => {
		if (!id || !state[id] || state[id].read === read) {
			return state;
		}
		return {
			...state,
			[id]: {
				...state[id],
				read,
			}
		}
	},

}, initialState);

export function getAllFeedItems(state) {
	return state && state.feedItems;
}

export function getAllFeedItemIds(state) {
	return state && state.feedItems && Object.keys(state.feedItems);
}

export function getAllUnreadFeedItemIds(state) {
	if (!state || !state.feedItems) {
		return [];
	}
	const unreadFeedItems = _.filter(state.feedItems, { read: false })
	return Object.keys(unreadFeedItems);
}

export function getFeedItem(state, id) {
	return state && state.feedItems && state.feedItems[id];
}

export function getCountForFeed(state, id) {
	let matchingFeeds = state.feedItems;
	if (id !== ALL_SUBSCRIPTION) {
		matchingFeeds = _.filter(state.feedItems, { feed_id: parseInt(id, 10) });
	}

	if (getShowFilter(state) === SHOW_UNREAD) {
		matchingFeeds = _.filter(matchingFeeds, { read: false });
	}

	return Object.keys(matchingFeeds).length
}