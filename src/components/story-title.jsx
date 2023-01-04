import React from 'react';
import { connect } from 'react-redux';
import sanitizeHtml from 'sanitize-html';

import { getSelectedFeedItemId } from '../redux/reducers/app-state-store';
import { getFeedItem } from '../redux/reducers/feed-items-store';
import { getSubscriptionById } from '../redux/reducers/subscriptions-store';
import Timestamp from './timestamp';

function StoryTitle({
	published,
	feed_name,
	author,
	title,
	summary,
	url,
	read,
} = {}) {
	if (!title && !summary) {
		return false;
	}
	const sanitizedTitle = sanitizeHtml(title || summary.split(' ').slice(0, 15).join(' ') + '...', {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'iframe' ]),
		allowedAttributes: {
			...sanitizeHtml.defaults.allowedAttributes,
			iframe: ['src', 'width', 'height']
		},
	});
	return (
		<div className="story-title" style={{ padding: '20px' }}>
			<div style={{ color: '#919190' }}>
				<Timestamp time={published} />
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
	const feedItem = getFeedItem(state, feedItemId);
	const subscription = getSubscriptionById(state, feedItem && feedItem.feed_id);

	return {
		...feedItem,
		feed_name: subscription && subscription.title,
	};
}

export default connect(mapStateToProps)(StoryTitle);
