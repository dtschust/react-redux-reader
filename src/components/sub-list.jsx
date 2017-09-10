import React from 'react';
import { connect } from 'react-redux';

import { getAllSubscriptionIds, getUnreadSubscriptionIds } from '../redux/reducers/subscriptions-store';
import { getShowFilter, SHOW_UNREAD } from '../redux/reducers/app-state-store';
import SubListItem from './sub-list-item';
import AllSubListItem from './all-sub-list-item';

const SubList = ({ subscriptionIds }) => {
	return (
		<div>
			<AllSubListItem />
			{subscriptionIds.map(
				id => {
					return <SubListItem id={id} key={id} />
				}
			)}
		</div>
	);
};

function mapStateToProps(state) {
	const showUnread = getShowFilter(state) === SHOW_UNREAD;
	return {
		subscriptionIds: showUnread ?
			getUnreadSubscriptionIds(state) :
			getAllSubscriptionIds(state),
	};
}

export default connect(mapStateToProps)(SubList);

