import { createReducer, createAction } from 'redux-act';

const initialState = { tagsToSubs: {}, subsToTags: {}};
export const setTaggings = createAction('Set the taggings');

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

		return { tagsToSubs, subsToTags }
	},
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