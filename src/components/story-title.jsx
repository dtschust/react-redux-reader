import React from 'react';
import { connect } from 'react-redux';
import sanitizeHtml from 'sanitize-html';

import { getSelectedFeedItemId } from '../redux/reducers/app-state-store';
import { getFeedItem } from '../redux/reducers/feed-items-store';
import Timestamp from './timestamp';

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
	const sanitizedTitle = sanitizeHtml(title, {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'iframe' ]),
		allowedAttributes: {
			...sanitizeHtml.defaults.allowedAttributes,
			iframe: ['src', 'width', 'height']
		},
	});
	return (
		<div className="story-title" style={{ padding: '20px' }}>
			<div style={{ color: '#919190' }}>
				<Timestamp time={published_at * 1000} />
			</div>
			<h1 style={{ margin: '15px 0' }}>
				<a
					style={{ textDecoration: 'none', fontSize: '42px' }}
					href={url}
					target="_blank"
					dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
				/>
			</h1>
			<div style={{ color: '#919190' }}>{author}</div>
			<div style={{ color: '#919190' }}>{feed_name}</div>
		</div>
	);
}

function mapStateToProps(state) {
	const feedItemId = getSelectedFeedItemId(state);
	if (!feedItemId) {
		return {};
	}
	return getFeedItem(state, feedItemId);
}

export default connect(mapStateToProps)(StoryTitle);
