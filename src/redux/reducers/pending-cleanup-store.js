import { createAction, createReducer } from 'redux-act';
import { updateReadStatus } from './feed-items-store';
import { selectSub } from './app-state-store';

export const cleanup = createAction('Clear out all read items that need to be cleaned up');

const initialState = {};

export default createReducer({
	[cleanup]: (state, payload) => {
		return initialState;
	},
	[selectSub]: (state, payload) => {
		return initialState;
	},
	[updateReadStatus]: (state, { id, read } = {}) => {
		if (read) {
			return {
				...state,
				[id]: true,
			}
		} else {
			const newState = { ...state };
			delete newState[id];
			return newState;
		}
	},
}, initialState);