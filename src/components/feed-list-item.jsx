import React from 'react';
import { connect } from 'react-redux';
import sanitizeHtml from 'sanitize-html';

import {
	getFeedItem,
	getFeedItemUnread,
} from '../redux/reducers/feed-items-store';
import {
	selectFeedItem,
	getSelectedFeedItemId,
} from '../redux/reducers/app-state-store';
import { getSubscriptionById } from '../redux/reducers/subscriptions-store';

import Timestamp from './timestamp';

function BaseFeedListItem({
	id,
	selectFeedItem,
	published,
	feed_name,
	title,
	summary,
	read,
	isActive,
} = {}) {
	const sanitizedTitle = sanitizeHtml(title || summary.split(' ').slice(0, 15).join(' ') + '...', {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'iframe' ]),
		allowedAttributes: {
			...sanitizeHtml.defaults.allowedAttributes,
			iframe: ['src', 'width', 'height']
		},
	});
	return (
		<div
			id={`feed-item-${id}`}
			style={{
				backgroundColor: isActive ? '#5e5d5e' : undefined,
				borderBottom: '1px solid #3a3a3a',
				padding: '0 20px 10px',
				cursor: 'pointer',
			}}
			onClick={() => {
				selectFeedItem(id);
			}}
		>
			<div style={{ color: '#919190', fontSize: '12px', padding: '5px 0 0' }}>
				{feed_name}
				<Timestamp
					style={{ float: 'right' }}
					time={published}
					approximate
				/>
			</div>
			<div
				style={{
					fontWeight: read ? 'normal' : 'bold',
					padding: '5px 0',
					color: read ? '#bebebe' : '#e6e5e6',
				}}
				dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
			/>
			<div
				style={{
					color: '#919190',
					fontSize: '14px',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
				}}
			>
				{summary === 'null' ? '': summary}
			</div>
		</div>
	);
}

function mapStateToProps(state, { id }) {
	const feedItem = getFeedItem(state, id);
	const subscription = getSubscriptionById(state, feedItem && feedItem.feed_id);
	return {
		...feedItem,
		id,
		read: !getFeedItemUnread(state, id),
		isActive: getSelectedFeedItemId(state) === id,
		feed_name: subscription && subscription.title,
	};
}

const mapDispatchToProps = {
	selectFeedItem,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(BaseFeedListItem);
