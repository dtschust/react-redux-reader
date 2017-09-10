import { createAction, createReducer } from 'redux-act';

export const selectSub = createAction('Select a subscription, or ALL or undefined');
export const selectFeedItem = createAction('Select a feed item by id');
export const updateShowFilter = createAction('Change the filter to show ALL or UNREAD');

export const ALL_SUBSCRIPTION = 'ALL_SUBSCRIPTION';

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

export function getShowFilter(state) {
	return state && state.appState && state.appState.show;
}

export function getSelectedSub(state) {
	return state && state.appState && state.appState.selectedSub;
}
