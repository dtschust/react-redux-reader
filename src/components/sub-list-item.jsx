import { connect } from 'react-redux';

import { getSubscriptionById } from '../redux/reducers/subscriptions-store';
import { getCountForFeed } from '../redux/reducers/feed-items-store';
import { getTagsForSub } from '../redux/reducers/taggings-store'
import { selectSub, getSelectedSub } from '../redux/reducers/app-state-store';
import BaseSubListItem from './base-sub-list-item';

function mapStateToProps(state, { id }) {
	const sub = getSubscriptionById(state, id);
	const tags = getTagsForSub(state, id) || [];

	// Just use the first tag for now, I don't need to really support multiple tags per feed
	const tag = tags && tags.length ? tags[0] : null;
	return {
		id,
		title: sub && sub.title,
		tag,
		count: getCountForFeed(state, id),
		isActive: getSelectedSub(state) === id,
	};
}

const mapDispatchToProps = {
	selectSub,
};

export default connect(mapStateToProps, mapDispatchToProps)(BaseSubListItem);
