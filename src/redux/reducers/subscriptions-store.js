import { createAction, createReducer } from 'redux-act';

export const updateSubscriptions = createAction('Update subscriptions');

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