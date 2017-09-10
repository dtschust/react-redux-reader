import React from 'react';
import { connect } from 'react-redux';

import { getShowFilter, getSelectedSub, SHOW_UNREAD } from '../redux/reducers/app-state-store';
import { getFeedItemIdsForSelectedSub } from '../redux/reducers/feed-items-store';

import FeedListItem from './feed-list-item';

const FeedList = ({ feedIds }) => {
	return (
		<div>
			{feedIds.map(
				id => {
					return <FeedListItem id={id} key={id} />
				}
			)}
		</div>
	);
};

function mapStateToProps(state) {
	return {
		feedIds: getFeedItemIdsForSelectedSub(state),
	};
}

export default connect(mapStateToProps)(FeedList);

