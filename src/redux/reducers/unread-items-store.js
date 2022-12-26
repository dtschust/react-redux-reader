import _ from 'lodash';
import { createReducer } from 'redux-act';
import { setAllUnreadIds, updateReadStatus, deleteFeedItemsById } from './feed-items-store';

const initialState = {};

export default createReducer({
	[setAllUnreadIds]: (state, payload) => {
		return payload;
	},
	[updateReadStatus]: (state, { id, read } = {}) => {
		if (!!state[id] === !read) {
			return state;
		}
		return {
			...state,
			[id]: !read,
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