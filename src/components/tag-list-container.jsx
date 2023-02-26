import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { getTaggedSubscriptionIds, getTaggedUnreadSubscriptionIds } from '../redux/reducers/subscriptions-store';
import {
	getShowFilter,
	SHOW_UNREAD,
} from '../redux/reducers/app-state-store';
import { getSubsForTag } from '../redux/reducers/taggings-store';
import { getCountForFeed } from '../redux/reducers/feed-items-store';
import SubListItem from './sub-list-item';

function mapStateToProps(state, { tag }) {
	const showUnread = getShowFilter(state) === SHOW_UNREAD;
	const tags= showUnread
		? getTaggedUnreadSubscriptionIds(state)
		: getTaggedSubscriptionIds(state);
	const count = _.sum(getSubsForTag(state, tag).map((feed_id => getCountForFeed(state, feed_id))));
	return {
		tags,
		count,
	}
}

class BaseTagListContainer extends Component {
	constructor(props) {
		super(props);
		this.state = { expand: true };
	}

	render() {
		const { tags, tag, style, count = 69 } = this.props;

		return (
			<div
			id={`tag-item-${tag}`}
			style={{
				backgroundColor: undefined,
				padding: '0 15px',
				cursor: 'pointer',
				...style,
			}}
		>
			<div
				style={{
					lineHeight: '2',
					display: 'flex',
				}}
				onClick={() => this.setState((prevState) => ({ expand: !prevState.expand}))}
			>
				<div
					style={{
						flex: '1',
						justifyContent: 'flex-start',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
				>
					{this.state.expand ? '▾ ': '▸ '}{tag}
				</div>
				<div
					style={{
						flex: '1',
						justifyContent: 'flex-end',
						maxWidth: '15px',
						paddingLeft: '5px',
					}}
				>
					{count > 0 ? count : undefined}
				</div>
			</div>
				{this.state.expand && tags[tag].map(id => {
					return <SubListItem id={id} key={id} />;
				})}
		</div>
		)

	}
}

export default connect(mapStateToProps)(BaseTagListContainer);
