import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { getTaggedSubscriptionIds, getTaggedUnreadSubscriptionIds } from '../redux/reducers/subscriptions-store';
import {
	getShowFilter,
	selectTag,
	getSelectedTag,
	SHOW_UNREAD,
} from '../redux/reducers/app-state-store';
import { getSubsForTag, isTagExpanded, toggleTag } from '../redux/reducers/taggings-store';
import { getCountForFeed } from '../redux/reducers/feed-items-store';
import SubListItem from './sub-list-item';

class BaseTagListContainer extends Component {
	render() {
		const { tags, tag, style, count } = this.props;

		return (
			<div
			id={`tag-item-${tag}`}
			style={{
				backgroundColor: undefined,
				padding: '0 15px 0 0',
				cursor: 'pointer',
				...style,
			}}
		>
			<div
				style={{
					backgroundColor: this.props.isActive ? '#535353' : undefined,
					lineHeight: '2',
					display: 'flex',
				}}
			onClick={() => {
				this.props.selectTag(tag);
			}}

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
					<span onClick={(e) => {
						e.stopPropagation();
						this.props.toggleTag(tag);
					}}>
						{this.props.expanded ? '▾ ': '▸ '}
					</span>
					{tag}
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
			</div >
			<div style={{ paddingLeft: '10px'}}>
				{this.props.expanded && tags[tag].map(id => {
					return <SubListItem id={id} key={id} />;
				})}
			</div>
		</div>
		)

	}
}

function mapStateToProps(state, { tag }) {
	const showUnread = getShowFilter(state) === SHOW_UNREAD;
	const tags= showUnread
		? getTaggedUnreadSubscriptionIds(state)
		: getTaggedSubscriptionIds(state);
	const count = _.sum(getSubsForTag(state, tag).map((feed_id => getCountForFeed(state, feed_id))));
	return {
		tags,
		count,
		isActive: getSelectedTag(state) === tag,
		expanded: isTagExpanded(state, tag),
	}
}

const mapDispatchToProps = {
	selectTag,
	toggleTag,
};

export default connect(mapStateToProps, mapDispatchToProps)(BaseTagListContainer);
