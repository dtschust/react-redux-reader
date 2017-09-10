import React from 'react';
import { connect } from 'react-redux';

import { getSelectedSub, getShowFilter, ALL_SUBSCRIPTION, SHOW_UNREAD } from '../redux/reducers/app-state-store';
import { getCountForFeed } from '../redux/reducers/feed-items-store';

import BaseSubListItem from './base-sub-list-item';

function mapDispatchToProps(state) {
	const show = getShowFilter(state);

	const title = show === SHOW_UNREAD ? 'Unread' : 'All';
	return {
		title,
		count: getCountForFeed(state, ALL_SUBSCRIPTION),
		isActive: getSelectedSub(state) === ALL_SUBSCRIPTION,
	};
}

export default connect(mapDispatchToProps)(BaseSubListItem);