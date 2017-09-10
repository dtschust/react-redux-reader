import { createAction, createReducer } from 'redux-act';
import sanitizeHtml from 'sanitize-html';

import { apiFetchFeedItems, apiUpdateFeedItem } from '../../feed-wrangler-api';
import { SHOW_UNREAD } from './app-state-store';

export const addFeedItems = createAction('Add feed items');
const updateReadStatus = createAction('Update the read status of an item by id');

export function fetchFeedItems(limit, offset, feedId) {
	return (dispatch, getState) => {
		const read = getState().appState.show === SHOW_UNREAD ?
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
