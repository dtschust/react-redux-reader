import { createReducer, createAction } from 'redux-act';

const initialState = { tagsToSubs: {}, subsToTags: {}, collapsedTags: {}};
export const setTaggings = createAction('Set the taggings');
export const toggleTag = createAction('expand or collapse a given tag');
export const expandTag = createAction('expand a given tag');

export default createReducer({
	[setTaggings]: (state, payload) => {
		const tagsToSubs = payload.reduce((acc, tag) => {
			acc[tag.name] = acc[tag.name] || [];
			acc[tag.name].push(tag.feed_id);
			return acc;
		}, {})

		const subsToTags = payload.reduce((acc, tag) => {
			acc[tag.feed_id] = acc[tag.feed_id] || [];
			acc[tag.feed_id].push(tag.name);
			return acc;
		}, {})

		return { tagsToSubs, subsToTags, collapsedTags: { ...state.collapsedTags } }
	},
	[toggleTag]: (state, tag) => {
		return {
			tagsToSubs: { ...state.tagsToSubs },
			subsToTags: { ...state.subsToTags },
			collapsedTags: { ...state.collapsedTags, [tag]: !state.collapsedTags[tag] }
		}
	},
	[expandTag]: (state, tag) => {
		if (!state.collapsedTags[tag]) {
			return state;
		}
		return {
			tagsToSubs: { ...state.tagsToSubs },
			subsToTags: { ...state.subsToTags },
			collapsedTags: { ...state.collapsedTags, [tag]: !state.collapsedTags[tag] }
		}
	}
}, initialState);

export function getAllTags(state) {
	return Object.keys(state.taggings.tagsToSubs);
}

export function getSubsForTag(state, tag) {
	return state.taggings.tagsToSubs[tag]
}

export function getTagsForSub(state, feed_id) {
	return state.taggings.subsToTags[feed_id] || [];
}

export function isTagExpanded(state, tag) {
	return !state.taggings.collapsedTags[tag];
}