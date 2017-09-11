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
	url,
	read,
} = {}) {
	if (!title) {
		return false;
	}
	return (
		<div style={{

		}}>
			<div style={{ color: '#919190' }}>{moment(published_at * 1000).calendar()}</div>
			<h1 style={{ margin: '15px 0' }}><a style={{ textDecoration: 'none', fontSize: '42px' }} href={url} target='_blank'>{title}</a></h1>
			<div style={{ color: '#919190' }}>{author}</div>
			<div style={{ color: '#919190' }}>{feed_name}</div>
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