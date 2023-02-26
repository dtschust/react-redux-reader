import React, { Component } from 'react';
import { connect } from 'react-redux';
import Mousetrap from 'mousetrap';
import _ from 'lodash';

import { logout } from '../feed-wrangler-api';
import {
	getAllSubscriptionIds,
	getUnreadSubscriptionIds,
	getTaggedSubscriptionIds,
	getTaggedUnreadSubscriptionIds,
} from '../redux/reducers/subscriptions-store';
import {
	toggleShowFilter,
	selectSub,
	selectTag,
	getSelectedSub,
	getSelectedTag,
	getShowFilter,
	getSyncingStatus,
	SHOW_UNREAD,
	ALL_SUBSCRIPTION,
} from '../redux/reducers/app-state-store';
import sync from '../redux/sync';
import SubListItem from './sub-list-item';
import AllSubListItem from './all-sub-list-item';
import TagListContainer from './tag-list-container';

class SubList extends Component {
	constructor(props) {
		super(props);
		this.keyboardShortcuts = {
			n: this.nextSub.bind(this),
			p: this.prevSub.bind(this),
		};
		this.sync = this.sync.bind(this);
		this.logout = this.logout.bind(this);
		this.toggleShowFilter = this.toggleShowFilter.bind(this);
	}

	componentDidMount() {
		_.forEach(this.keyboardShortcuts, (cb, shortcut) => {
			Mousetrap.bind(shortcut, cb);
		});
	}

	componentWillUnmount() {
		_.forEach(this.keyboardShortcuts, (cb, shortcut) => {
			Mousetrap.unbind(shortcut, cb);
		});
	}

	nextSub() {
		const { subscriptionIds, selectedSubscriptionId, selectedTag, selectSub, selectTag, tags } = this.props;
		let idToScrollTo;
		let tagToScrollTo;
		const tag = Object.keys(tags).find((tagToCheck) => {
			return tags[tagToCheck].includes(selectedSubscriptionId)
		})
		if (selectedTag) {
			idToScrollTo = tags[selectedTag].length ? tags[selectedTag][0] : ALL_SUBSCRIPTION;
		} else if (tag) {
			const currentTagIndex = tags[tag].indexOf(selectedSubscriptionId);
			if (currentTagIndex >= 0 && currentTagIndex + 1 < tags[tag].length) {
				idToScrollTo = tags[tag][currentTagIndex + 1];
			} else {
				// TODO: do better once I have multiple tags
				idToScrollTo = subscriptionIds[0];
			}
		} else if (selectedSubscriptionId === ALL_SUBSCRIPTION && Object.keys(tags).length) {
			tagToScrollTo = Object.keys(tags)[0];
		} else if (selectedSubscriptionId === ALL_SUBSCRIPTION && subscriptionIds[0]) {
			idToScrollTo = subscriptionIds[0];
		} else {
			const currentIndex = subscriptionIds.indexOf(selectedSubscriptionId);
			if (currentIndex >= 0 && currentIndex + 1 < subscriptionIds.length) {
				idToScrollTo = subscriptionIds[currentIndex + 1];
			} else {
				idToScrollTo = ALL_SUBSCRIPTION;
			}
		}

		if (tagToScrollTo) {
			selectTag(tagToScrollTo);
			document
				.querySelector(`#tag-item-${tagToScrollTo}`)
				.scrollIntoViewIfNeeded(false);

		} else {
			selectSub(idToScrollTo);
			document
				.querySelector(`#sub-item-${idToScrollTo}`)
				.scrollIntoViewIfNeeded(false);
		}
	}

	prevSub() {
		const { subscriptionIds, selectedSubscriptionId, selectSub, selectTag, tags } = this.props;
		let idToScrollTo;
		let tagToScrollTo;

		const tag = Object.keys(tags).find((tagToCheck) => {
			return tags[tagToCheck].includes(selectedSubscriptionId)
		})
		if (tag) {
			const currentTagIndex = tags[tag].indexOf(selectedSubscriptionId);
			if (currentTagIndex >= 0 && currentTagIndex - 1 >= 0) {
				idToScrollTo = tags[tag][currentTagIndex - 1];
			} else {
				tagToScrollTo = tag;
			}
		} else {
			const currentIndex = subscriptionIds.indexOf(selectedSubscriptionId);
			if (currentIndex === 0) {
				// Horrible code to jump to the last of the tagged feeds in the list
				if (Object.values(tags).length && Object.values(tags).slice(-1)[0].length) {
					idToScrollTo = Object.values(tags).slice(-1)[0].slice(-1)[0];
				} else {
					idToScrollTo = ALL_SUBSCRIPTION;
				}
			} else if (currentIndex >= 0 && currentIndex - 1 >= 0) {
				idToScrollTo = subscriptionIds[currentIndex - 1];
			} else {
				idToScrollTo = ALL_SUBSCRIPTION;
			}
		}


		if (tagToScrollTo) {
			selectTag(tagToScrollTo);
			document
				.querySelector(`#tag-item-${tagToScrollTo}`)
				.scrollIntoViewIfNeeded(false);

		} else {
			selectSub(idToScrollTo);
			document
				.querySelector(`#sub-item-${idToScrollTo}`)
				.scrollIntoViewIfNeeded(false);
		}
	}

	sync(e) {
		e.preventDefault();
		this.props.sync();
	}

	logout(e) {
		e.preventDefault();
		logout();
	}

	toggleShowFilter(e) {
		e.preventDefault();
		this.props.toggleShowFilter();
	}

	render() {
		return (
			<div id="sub-list">
				<div style={{ overflow: 'auto', flex: '1 1 0', paddingTop: '30px' }}>
					<AllSubListItem />
					{Object.keys(this.props.tags).map(tag => {
						return <TagListContainer key={tag} tag={tag} />

					})}
					{this.props.subscriptionIds.map(id => {
						return <SubListItem id={id} key={id} />;
					})}
				</div>
				<a
					style={{ marginTop: 'auto', padding: '10px 0' }}
					onClick={this.toggleShowFilter}
				>
					Show {this.props.showFilter === SHOW_UNREAD ? 'All' : 'Unread Only'}
				</a>
				<a style={{ padding: '10px 0' }} onClick={this.sync}>
					{this.props.syncing ? 'Syncing...' : 'Sync'}
				</a>
				<a style={{ padding: '10px 0' }} onClick={this.logout}>
					Logout
				</a>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const showUnread = getShowFilter(state) === SHOW_UNREAD;
	return {
		subscriptionIds: showUnread
			? getUnreadSubscriptionIds(state)
			: getAllSubscriptionIds(state),
		tags: showUnread
			? getTaggedUnreadSubscriptionIds(state)
			: getTaggedSubscriptionIds(state),
		selectedSubscriptionId: getSelectedSub(state),
		selectedTag: getSelectedTag(state),
		showFilter: getShowFilter(state),
		syncing: getSyncingStatus(state),
	};
}

const mapDispatchToProps = {
	selectSub,
	selectTag,
	sync,
	toggleShowFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubList);
