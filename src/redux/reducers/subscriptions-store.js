import { createAction, createReducer } from 'redux-act';
import { apiFetchSubscriptions } from '../../feed-wrangler-api';

export const updateSubscriptions = createAction('Update subscriptions');

export function fetchSubscriptions() {
	return (dispatch) => {
		apiFetchSubscriptions()
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