import _ from 'lodash';
import { createAction, createReducer } from 'redux-act';
import sanitizeHtml from 'sanitize-html';

import { apiFetchFeedItems, apiUpdateFeedItem } from '../../feed-wrangler-api';
import { getShowFilter, getSelectedSub, SHOW_UNREAD, ALL_SUBSCRIPTION } from './app-state-store';

export const addFeedItems = createAction('Add feed items');
export const setAllUnreadIds = createAction('Marks all of the unread ids');
export const updateReadStatus = createAction('Update the read status of an item by id');
export const deleteFeedItemsById = createAction('Delete feed items by id');

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
			dispatch(addFeedItems(response));
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
		const read = getFeedItemUnread(getState(), id);
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
				summary.innerHTML = sanitizeHtml(feedItem.content);
				summary = summary.innerText;
				result[feedItem.id] = {
					...feedItem,
					summary,
					body: sanitizeHtml(feedItem.content, {
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
	[deleteFeedItemsById]: (state, ids = []) => {
		if (!ids || !ids.length) {
			return state;
		}
		return {
			..._.omit(state, ids),
		};
	},

}, initialState);

export function getAllFeedItems(state) {
	return state && state.feedItems;
}

export function getAllFeedItemIds(state) {
	return state && state.feedItems && Object.keys(state.feedItems);
}

export function getAllUnreadFeedItemIds(state) {
	return state && state.unreadItems && Object.keys(state.unreadItems);
}

export function getFeedItem(state, id) {
	return state && state.feedItems && state.feedItems[id];
}

export function getFeedItemUnread(state, id) {
	return state && state.unreadItems && !!state.unreadItems[id];
}

export function getCountForFeed(state, id) {
	let feedItems = getFeedItemsForSub(state, id);

	if (getShowFilter(state) === SHOW_UNREAD) {
		feedItems = _.filter(feedItems, (feed) => getFeedItemUnread(state, feed.id));
	}
	return Object.keys(feedItems).length;
}

export function getFeedItemIdsForSelectedSub(state) {
	const selectedSub = getSelectedSub(state);
	return _.map(getFeedItemsForSub(state, selectedSub), 'id');
}

function getFeedItemsForSub(state, sub) {
	const pendingCleanup = state.pendingCleanup;
	let matchingFeeds = state.feedItems;
	if (sub !== ALL_SUBSCRIPTION) {
		matchingFeeds = _.filter(state.feedItems, { feed_id: parseInt(sub, 10) });
	}

	if (getShowFilter(state) === SHOW_UNREAD) {
		matchingFeeds = _.filter(matchingFeeds, (feed) => {
			if (getFeedItemUnread(state, feed.id)) {
				return true;
			}
			if (pendingCleanup[feed.id]) {
				return true
			}
			return false;
		});
	}

	return _(matchingFeeds)
		.sortBy((feedItem) => (new Date(feedItem.published).getTime()))
		.reverse()
		.value();
}