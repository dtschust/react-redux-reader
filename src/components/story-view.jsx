import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { getSelectedFeedItemId } from '../redux/reducers/app-state-store';
import { getFeedItem } from '../redux/reducers/feed-items-store';

function StoryView({
	body,
} = {}) {
	return (
		<div style={{
			padding: '50px 0px',
			lineHeight: '1.5',
		}} dangerouslySetInnerHTML={{__html: body}} />
	)
}

function mapStateToProps(state) {
	const feedItemId = getSelectedFeedItemId(state);
	if (!feedItemId) {
		return {};
	}
	return getFeedItem(state, feedItemId);
}

export default connect(mapStateToProps)(StoryView);