import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { getFeedItem } from '../redux/reducers/feed-items-store';
import { selectFeedItem, getSelectedFeedItemId } from '../redux/reducers/app-state-store';

function BaseFeedListItem({
	id,
	selectFeedItem,
	published_at,
	feed_name,
	title,
	summary,
	read,
	isActive,
} = {}) {
	return (
		<div
			style={{ backgroundColor: isActive ? 'blue': undefined }}
			onClick={() => {selectFeedItem(id)}}
		>
			<div>{feed_name} (about {moment(published_at * 1000).fromNow()})</div>
			<div style={{ fontWeight: read ? 'normal': 'bold' }}>{title}</div>
			<div dangerouslySetInnerHTML={{__html: summary}} />
		</div>
	)

}

function mapStateToProps(state, { id }) {
	const feedItem = getFeedItem(state, id);
	return {
		...feedItem,
		id,
		isActive: getSelectedFeedItemId(state) === id,
	}
}

const mapDispatchToProps = {
	selectFeedItem
}

export default connect(mapStateToProps, mapDispatchToProps)(BaseFeedListItem)