import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { getFeedItem } from '../redux/reducers/feed-items-store';
import { getSelectedFeedItemId } from '../redux/reducers/app-state-store';

function BaseFeedListItem({
	published_at,
	feed_name,
	title,
	summary,
	read,
	isActive,
} = {}) {
	return (
		<div>
			<div>{feed_name} (about {moment(published_at * 1000).fromNow()})</div>
			<div>{title}</div>
			<div dangerouslySetInnerHTML={{__html: summary}} />
		</div>
	)

}

function mapStateToProps(state, { id }) {
	const feedItem = getFeedItem(state, id);
	return {
		...feedItem,
		isActive: getSelectedFeedItemId(state) === id,
	}


}

export default connect(mapStateToProps)(BaseFeedListItem)