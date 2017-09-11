import { createAction, createReducer } from 'redux-act';

export const selectSub = createAction('Select a subscription, or ALL or undefined');
export const selectFeedItem = createAction('Select a feed item by id');
export const toggleShowFilter = createAction('Change the filter to show ALL or UNREAD');
export const updateSyncingState = createAction('Start or stop syncing');

export const ALL_SUBSCRIPTION = 'ALL_SUBSCRIPTION';

const SHOW_ALL = 'SHOW_ALL';
export const SHOW_UNREAD = 'SHOW_UNREAD';

const initialState = {
	selectedSub: ALL_SUBSCRIPTION,
	selectedFeedItem: undefined,
	show: SHOW_UNREAD,
	syncing: false,
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
	[updateSyncingState]: (state, syncing) => {
		return {
			...state,
			syncing,
		}
	},
	[toggleShowFilter]: (state) => {
		return {
			...state,
			show: state.show === SHOW_UNREAD ? SHOW_ALL : SHOW_UNREAD,
		}
	},

}, initialState);

export function getShowFilter(state) {
	return state && state.appState && state.appState.show;
}

export function getSelectedSub(state) {
	return state && state.appState && state.appState.selectedSub;
}

export function getSelectedFeedItemId(state) {
	return state && state.appState && state.appState.selectedFeedItem;
}

export function getSyncingStatus(state) {
	return state && state.appState && state.appState.syncing;
}