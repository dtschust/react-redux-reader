import { connect } from 'react-redux';

import {
	getSelectedSub,
	getShowFilter,
	ALL_SUBSCRIPTION,
	SHOW_UNREAD,
} from '../redux/reducers/app-state-store';
import { getCountForFeed } from '../redux/reducers/feed-items-store';
import { selectSub } from '../redux/reducers/app-state-store';

import BaseSubListItem from './base-sub-list-item';

function mapStateToProps(state) {
	const show = getShowFilter(state);

	const title = show === SHOW_UNREAD ? 'Unread' : 'All';
	return {
		id: ALL_SUBSCRIPTION,
		title,
		count: getCountForFeed(state, ALL_SUBSCRIPTION),
		isActive: getSelectedSub(state) === ALL_SUBSCRIPTION,
		style: {
			marginBottom: '20px',
		},
	};
}

const mapDispatchToProps = {
	selectSub,
};

export default connect(mapStateToProps, mapDispatchToProps)(BaseSubListItem);
