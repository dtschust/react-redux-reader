import _ from 'lodash';
import { createAction, createReducer } from 'redux-act';
import sanitizeHtml from 'sanitize-html';

import { apiFetchFeedItems, apiUpdateFeedItem } from '../../feed-wrangler-api';
import { getShowFilter, getSelectedSub, SHOW_UNREAD, ALL_SUBSCRIPTION } from './app-state-store';

export const addFeedItems = createAction('Add feed items');
export const updateReadStatus = createAction('Update the read status of an item by id');

function fetchFeedItems(limit, offset, feedId) {
	return (dispatch, getState) => {
		const read = getShowFilter(getState()) === SHOW_UNREAD ?
			false :
			undefined;
		const options = {
			feedId,
			read,
		}
		return apiFetchFeedItems(limit, offset, options)
		.then((response) => {
			dispatch(addFeedItems(response.feed_items));
		});
	}
}

export function fetchFeedItemsForSub(subscriptionId) {
	return (dispatch) => {
		return dispatch(fetchFeedItems(undefined, undefined, subscriptionId));
	}
}

export function toggleReadStatus(id) {
	return (dispatch, getState) => {
		const read = !getFeedItem(getState(), id).read;
		apiUpdateFeedItem(id, { read }).then(({ result } = {}) => {
			if (result === 'success') {
				dispatch(updateReadStatus({ id, read }));
			}
		});
	}
}

export function openFeedItemInBrowser(id) {
	return (dispatch, getState) => {
		window.open(getFeedItem(getState(), id).url, '_blank');
	}
}

const initialState = {};

export default createReducer({
	[addFeedItems]: (state, payload) => {
		const updates = payload.reduce(
			(result, feedItem) => {
				let summary = document.createElement('div')
				summary.innerHTML = sanitizeHtml(feedItem.body);
				summary = summary.innerText;
				result[feedItem.feed_item_id] = {
					...feedItem,
					summary,
					body: sanitizeHtml(feedItem.body, {
						allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'iframe' ]),
						allowedAttributes: {
							...sanitizeHtml.defaults.allowedAttributes,
							iframe: ['src', 'width', 'height']
						},
					}),
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
	return Object.keys(getFeedItemsForSub(state, id)).length;
}

export function getFeedItemIdsForSelectedSub(state) {
	const selectedSub = getSelectedSub(state);
	return _.map(getFeedItemsForSub(state, selectedSub), 'feed_item_id');
}

function getFeedItemsForSub(state, sub) {
	const pendingCleanup = state.pendingCleanup;
	let matchingFeeds = state.feedItems;
	if (sub !== ALL_SUBSCRIPTION) {
		matchingFeeds = _.filter(state.feedItems, { feed_id: parseInt(sub, 10) });
	}

	if (getShowFilter(state) === SHOW_UNREAD) {
		matchingFeeds = _.filter(matchingFeeds, (feed) => {
			if (!feed.read) {
				return true;
			}
			if (pendingCleanup[feed.feed_item_id]) {
				return true
			}
			return false;
		});
	}

	return _(matchingFeeds).sortBy('published_at').reverse().value();
}