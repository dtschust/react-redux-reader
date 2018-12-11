import React from 'react';
import { connect } from 'react-redux';

import { getSelectedFeedItemId } from '../redux/reducers/app-state-store';
import { getFeedItem } from '../redux/reducers/feed-items-store';

function StoryView({ body } = {}) {
	if (!body) {
		return false;
	}
	return (
		<div
			className="story-view"
			style={{
				padding: '50px 20px',
				lineHeight: '1.5',
			}}
			dangerouslySetInnerHTML={{ __html: body }}
		/>
	);
}

function mapStateToProps(state) {
	const feedItemId = getSelectedFeedItemId(state);
	if (!feedItemId) {
		return {};
	}
	return getFeedItem(state, feedItemId);
}

export default connect(mapStateToProps)(StoryView);
