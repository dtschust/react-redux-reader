import React, { Component } from 'react';
import { connect } from 'react-redux';
import Mousetrap from 'mousetrap';
import _ from 'lodash';

import { selectFeedItem, getShowFilter, getSelectedSub, getSelectedFeedItemId, SHOW_UNREAD } from '../redux/reducers/app-state-store';
import { openFeedItemInBrowser, toggleReadStatus, getFeedItemIdsForSelectedSub } from '../redux/reducers/feed-items-store';
import { cleanup } from '../redux/reducers/pending-cleanup-store';

import FeedListItem from './feed-list-item';

class FeedList extends Component {
	constructor(props) {
		super(props);
		this.keyboardShortcuts = {
			j: this.nextItem.bind(this),
			k: this.prevItem.bind(this),
			m: this.toggleRead.bind(this),
			b: this.openInBrowser.bind(this),
			c: this.cleanup.bind(this),
			escape: this.unselectItem.bind(this),
		};
	}
	componentDidMount() {
		_.forEach(this.keyboardShortcuts, (cb, shortcut) => {
			Mousetrap.bind(shortcut, cb);
		})
	}
	componentWillUnmount() {
		_.forEach(this.keyboardShortcuts, (cb, shortcut) => {
			Mousetrap.unbind(shortcut, cb);
		})
	}

	nextItem() {
		const { feedIds, selectedFeedId, selectFeedItem } = this.props;

		const currentIndex = feedIds.indexOf(selectedFeedId);
		if (currentIndex >= 0 && currentIndex + 1 < feedIds.length) {
			selectFeedItem(feedIds[currentIndex + 1]);
		} else {
			selectFeedItem(feedIds[0]);
		}
	}

	prevItem() {
		const { feedIds, selectedFeedId, selectFeedItem } = this.props;

		const currentIndex = feedIds.indexOf(selectedFeedId);
		if (currentIndex === 0) {
			return;
		} else if (currentIndex > 0 && currentIndex - 1 >= 0) {
			selectFeedItem(feedIds[currentIndex - 1]);
		} else {
			selectFeedItem(feedIds[0]);
		}
	}

	toggleRead() {
		const { selectedFeedId, toggleReadStatus } = this.props;
		toggleReadStatus(selectedFeedId);
	}

	cleanup() {
		this.props.cleanup();
	}

	openInBrowser() {
		const { selectedFeedId, openFeedItemInBrowser } = this.props;
		selectedFeedId && openFeedItemInBrowser(selectedFeedId);
	}

	unselectItem() {
		this.props.selectFeedItem(undefined);
	}

	render() {
		return (
			<div id="feed-list">
				{this.props.feedIds.map(
					id => {
						return <FeedListItem id={id} key={id} />
					}
				)}
			</div>
		);
	}
};

function mapStateToProps(state) {
	return {
		feedIds: getFeedItemIdsForSelectedSub(state),
		selectedFeedId: getSelectedFeedItemId(state),
	};
}

const mapDispatchToProps = {
	openFeedItemInBrowser,
	selectFeedItem,
	toggleReadStatus,
	cleanup,
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedList);

