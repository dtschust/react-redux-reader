import React, { Component } from 'react';
import { connect } from 'react-redux';
import Mousetrap from 'mousetrap';
import _ from 'lodash';

import {
	selectFeedItem,
	getSelectedFeedItemId,
	getSelectedSub,
	getShowFilter,
	SHOW_UNREAD,
	ALL_SUBSCRIPTION,
} from '../redux/reducers/app-state-store';
import {
	openFeedItemInBrowser,
	toggleReadStatus,
	getFeedItemIdsForSelectedSub,
	fetchFeedItemsForSub,
} from '../redux/reducers/feed-items-store';
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
		this.fetchFeedsForActiveSub = this.fetchFeedsForActiveSub.bind(this);
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

	nextItem() {
		const { feedIds, selectedFeedId, selectFeedItem } = this.props;
		let idToScrollTo;

		const currentIndex = feedIds.indexOf(selectedFeedId);
		if (currentIndex >= 0 && currentIndex + 1 < feedIds.length) {
			idToScrollTo = feedIds[currentIndex + 1];
		} else {
			idToScrollTo = feedIds[0];
		}

		selectFeedItem(idToScrollTo);
		document
			.querySelector(`#feed-item-${idToScrollTo}`)
			.scrollIntoViewIfNeeded(false);
	}

	prevItem() {
		const { feedIds, selectedFeedId, selectFeedItem } = this.props;
		let idToScrollTo;

		const currentIndex = feedIds.indexOf(selectedFeedId);
		if (currentIndex === 0) {
			return;
		} else if (currentIndex > 0 && currentIndex - 1 >= 0) {
			idToScrollTo = feedIds[currentIndex - 1];
		} else {
			idToScrollTo = feedIds[0];
		}

		selectFeedItem(idToScrollTo);
		document
			.querySelector(`#feed-item-${idToScrollTo}`)
			.scrollIntoViewIfNeeded(false);
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

	fetchFeedsForActiveSub(e) {
		e.preventDefault();
		this.props.fetchFeedItemsForSub(this.props.selectedSubId);
	}

	render() {
		if (
			this.props.feedIds.length === 0 &&
			this.props.showFilter !== SHOW_UNREAD &&
			this.props.selectedFeedId !== ALL_SUBSCRIPTION
		) {
			return (
				<div id="feed-list">
					Nothing here, want me to fetch something for you?
					<div>
						<button onClick={this.fetchFeedsForActiveSub}>Yes please!</button>
					</div>
				</div>
			);
		}
		return (
			<div id="feed-list">
				{this.props.feedIds.map(id => {
					return <FeedListItem id={id} key={id} />;
				})}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		feedIds: getFeedItemIdsForSelectedSub(state),
		selectedFeedId: getSelectedFeedItemId(state),
		selectedSubId: getSelectedSub(state),
		showFilter: getShowFilter(state),
	};
}

const mapDispatchToProps = {
	openFeedItemInBrowser,
	selectFeedItem,
	toggleReadStatus,
	cleanup,
	fetchFeedItemsForSub,
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedList);
