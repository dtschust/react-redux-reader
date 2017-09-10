import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { getSelectedFeedItemId } from '../redux/reducers/app-state-store';
import { getFeedItem } from '../redux/reducers/feed-items-store';

function StoryTitle({
	published_at,
	feed_name,
	author,
	title,
	read,
} = {}) {
	return (
		<div style={{border: '1px solid black'}}>
			<div>{moment(published_at * 1000).calendar()}</div>
			<h1>{title}</h1>
			<div>{author}</div>
			<div>{feed_name}</div>
		</div>
	)
}

function mapStateToProps(state) {
	const feedItemId = getSelectedFeedItemId(state);
	if (!feedItemId) {
		return {};
	}
	return getFeedItem(state, feedItemId);
}

export default connect(mapStateToProps)(StoryTitle);