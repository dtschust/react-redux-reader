import React from 'react';
import { connect } from 'react-redux';

import { getTaggedSubscriptionIds, getTaggedUnreadSubscriptionIds } from '../redux/reducers/subscriptions-store';
import {
	getShowFilter,
	SHOW_UNREAD,
} from '../redux/reducers/app-state-store';
import SubListItem from './sub-list-item';

function mapStateToProps(state, { id }) {
	const showUnread = getShowFilter(state) === SHOW_UNREAD;
	return {
		tags: showUnread
	? getTaggedUnreadSubscriptionIds(state)
	: getTaggedSubscriptionIds(state),
	}
}

const BaseTagListContainer = function({ tag, tags }) {
	return (
		<div>
			{tag}
			{tags[tag].map(id => {
				return <SubListItem id={id} key={id} />;
			})}
	</div>
	)
}

export default connect(mapStateToProps)(BaseTagListContainer);
