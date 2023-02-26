import { createAction, createReducer } from 'redux-act';
import { REHYDRATE } from 'redux-persist/constants'

export const selectSub = createAction('Select a subscription, or ALL or undefined');
export const selectTag = createAction('Select a tag');
export const selectFeedItem = createAction('Select a feed item by id');
export const toggleShowFilter = createAction('Change the filter to show ALL or UNREAD');
export const updateSyncingState = createAction('Start or stop syncing');
export const updateTimestampNonce = createAction('update timestamp nonce');

export const ALL_SUBSCRIPTION = 'ALL_SUBSCRIPTION';

const SHOW_ALL = 'SHOW_ALL';
export const SHOW_UNREAD = 'SHOW_UNREAD';

const initialState = {
	selectedSub: ALL_SUBSCRIPTION,
	selectedFeedItem: undefined,
	selectedTag: undefined,
	show: SHOW_UNREAD,
	syncing: false,
	timestampNonce: Date.now(),
}
export default createReducer({
	[REHYDRATE]: (state, payload) => {
		// Syncing state will not be updated from persistence
		return {
			...payload.appState,
			syncing: state.syncing
		};
	},
	[selectSub]: (state, id) => {
		return {
			...state,
			selectedSub: id,
			selectedTag: undefined,
		}
	},
	[selectTag]: (state, tag) => {
		return {
			...state,
			selectedTag: tag,
			selectedSub: undefined,
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
	[updateTimestampNonce]: (state) => {
		return {
			...state,
			timestampNonce: Date.now(),
		}
	},

}, initialState);

export function getShowFilter(state) {
	return state && state.appState && state.appState.show;
}

export function getSelectedSub(state) {
	return state && state.appState && state.appState.selectedSub;
}

export function getSelectedTag(state) {
	return state && state.appState && state.appState.selectedTag;
}

export function getSelectedFeedItemId(state) {
	return state && state.appState && state.appState.selectedFeedItem;
}

export function getSyncingStatus(state) {
	return state && state.appState && state.appState.syncing;
}

export function getTimestampNonce(state) {
	return state && state.appState && state.appState.timestampNonce;
}