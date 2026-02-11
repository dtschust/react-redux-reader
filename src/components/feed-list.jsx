import React, { Component } from 'react';
import { connect } from 'react-redux';
import Mousetrap from 'mousetrap';
import _ from 'lodash';

import {
	selectFeedItem,
	getSelectedFeedItemId,
	getSelectedSub,
	getSelectedTag,
	getShowFilter,
	SHOW_UNREAD,
	ALL_SUBSCRIPTION,
} from '../redux/reducers/app-state-store';
import {
	openFeedItemInBrowser,
	toggleReadStatus,
	getFeedItem,
	getFeedItemIdsForSelectedSub,
	getFeedItemIdsForSelectedTag,
	fetchFeedItemsForSub,
} from '../redux/reducers/feed-items-store';
import { cleanup } from '../redux/reducers/pending-cleanup-store';

import FeedListItem from './feed-list-item';

const IFRAME_LOAD_TIMEOUT_MS = 3000;

class FeedList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			iframeUrl: undefined,
		};
		this.iframeLoadTimeout = undefined;
		this.keyboardShortcuts = {
			j: this.nextItem.bind(this),
			k: this.prevItem.bind(this),
			m: this.toggleRead.bind(this),
			b: this.openInIframe.bind(this),
			o: this.openInBrowser.bind(this),
			c: this.cleanup.bind(this),
			escape: this.handleEscape.bind(this),
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
		this.clearIframeLoadTimeout();
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

	openInIframe() {
		const { selectedFeedItemUrl } = this.props;
		if (!selectedFeedItemUrl) {
			return;
		}
		this.setState({ iframeUrl: selectedFeedItemUrl }, () => {
			this.startIframeLoadTimeout(selectedFeedItemUrl);
		});
	}

	openInBrowser() {
		const { selectedFeedId, openFeedItemInBrowser } = this.props;
		this.clearIframeLoadTimeout();
		if (this.state.iframeUrl) {
			this.setState({ iframeUrl: undefined });
		}
		if (!selectedFeedId) {
			return;
		}
		openFeedItemInBrowser(selectedFeedId);
	}

	handleEscape() {
		if (this.state.iframeUrl) {
			this.clearIframeLoadTimeout();
			this.setState({ iframeUrl: undefined });
			return;
		}
		this.unselectItem();
	}

	startIframeLoadTimeout(expectedUrl) {
		this.clearIframeLoadTimeout();
		this.iframeLoadTimeout = window.setTimeout(() => {
			if (this.state.iframeUrl !== expectedUrl) {
				return;
			}
			this.openInBrowser();
		}, IFRAME_LOAD_TIMEOUT_MS);
	}

	clearIframeLoadTimeout() {
		if (this.iframeLoadTimeout) {
			window.clearTimeout(this.iframeLoadTimeout);
			this.iframeLoadTimeout = undefined;
		}
	}

	handleIframeLoad() {
		debugger;
		this.clearIframeLoadTimeout();
	}

	handleIframeError() {
		this.openInBrowser();
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
				{this.state.iframeUrl && (
					<div className="feed-item-modal-overlay">
						<iframe
							title="Feed item preview"
							className="feed-item-modal-iframe"
							src={this.state.iframeUrl}
							onLoad={this.handleIframeLoad.bind(this)}
							onError={this.handleIframeError.bind(this)}
						/>
					</div>
				)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	const tag = getSelectedTag(state);
	const selectedFeedId = getSelectedFeedItemId(state);
	const selectedFeedItem = selectedFeedId ? getFeedItem(state, selectedFeedId) : undefined;
	return {
		feedIds: tag ? getFeedItemIdsForSelectedTag(state, tag): getFeedItemIdsForSelectedSub(state),
		selectedFeedId,
		selectedFeedItemUrl: selectedFeedItem && selectedFeedItem.url,
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
