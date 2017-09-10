import { createAction, createReducer } from 'redux-act';

export const selectSub = createAction('Select a subscription, or ALL or undefined');
export const selectFeedItem = createAction('Select a feed item by id');
export const updateShowFilter = createAction('Change the filter to show ALL or UNREAD');

const ALL_SUBSCRIPTION = 'ALL_SUBSCRIPTION';

const SHOW_ALL = 'SHOW_ALL';
export const SHOW_UNREAD = 'SHOW_UNREAD';

const initialState = {
	selectedSub: ALL_SUBSCRIPTION,
	selectedFeedItem: undefined,
	show: SHOW_UNREAD,
}
export default createReducer({
	[selectSub]: (state, id) => {
		return {
			...state,
			selectedSub: id,
		}
	},
	[selectFeedItem]: (state, id) => {
		return {
			...state,
			selectedFeedItem: id,
		}

	},
	[updateShowFilter]: (state, show) => {
		return {
			...state,
			show,
		}
	},

}, initialState);
