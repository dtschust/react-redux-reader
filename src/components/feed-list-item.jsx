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
			id={`feed-item-${id}`}
			style={{
				backgroundColor: isActive ? '#f0eee8': undefined,
				borderBottom: '1px solid #e6e4de',
				padding: '10px 20px',
				cursor: 'pointer',
			}}
			onClick={() => {selectFeedItem(id)}}
		>
			<div style={{ color: '#919190', fontSize: '14px', padding: '5px 0' }}>
				{feed_name}
				<span style={{float: 'right'}}>(about {moment(published_at * 1000).fromNow()})</span>
			</div>
			<div style={{ fontWeight: read ? 'normal': 'bold' }}>{title}</div>
			<div style={{
				color: '#919190',
				fontSize: '14',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
			 }}>
				{summary}
			</div>
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