import { createAction, createReducer } from 'redux-act';

export const addFeedItems = createAction('Add feed items');
export const updateReadStatus = createAction('Update the read status of an item by id');

const initialState = {};

export default createReducer({
	[addFeedItems]: (state, payload) => {
		const updates = payload.reduce(
			(result, feedItem) => {
				result[feedItem.feed_item_id] = feedItem;
				return result;
			}, {}
		);
		return {
			...state,
			...updates,
		}
	},
	[updateReadStatus]: (state, { id, isRead } = {}) => {
		if (!id || !state[id] || state[id].read === isRead) {
			return state;
		}
		return {
			...state,
			[id]: {
				...state[id],
				read: isRead,
			}
		}
	},

}, initialState);
