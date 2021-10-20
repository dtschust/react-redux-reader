import React from 'react';
import { connect } from 'react-redux';
import { TwitterTweetEmbed } from 'react-twitter-embed';

import { getSelectedFeedItemId } from '../redux/reducers/app-state-store';
import { getFeedItem } from '../redux/reducers/feed-items-store';

function StoryView({ body, url } = {}) {
	let tweetId;
	try {
		if (url.indexOf('https://twitter.com/') === 0) {
			tweetId = url.match(/\/(\d+)(\?.*)?$/)[1];
		}
	} catch (e) {
		// I don't care
	}

	if (!body && !tweetId) {
		return false;
	}

	return (
		<div
			className="story-view"
			style={{
				padding: '50px 20px',
				lineHeight: '1.5',
			}}
		>
			{tweetId && (
				<div
					style={{
						marginBottom: '50px',
					}}
				>
					<TwitterTweetEmbed key={tweetId} tweetId={tweetId} />
				</div>
			)}
			<div dangerouslySetInnerHTML={{ __html: body }} />
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

export default connect(mapStateToProps)(StoryView);
