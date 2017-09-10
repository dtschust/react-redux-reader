import React, { Component } from 'react';
import { connect } from 'react-redux';
import Mousetrap from 'mousetrap';
import _ from 'lodash';

import { getAllSubscriptionIds, getUnreadSubscriptionIds } from '../redux/reducers/subscriptions-store';
import { selectSub, getSelectedSub, getShowFilter, SHOW_UNREAD, ALL_SUBSCRIPTION } from '../redux/reducers/app-state-store';
import SubListItem from './sub-list-item';
import AllSubListItem from './all-sub-list-item';

class SubList extends Component {
	constructor(props) {
		super(props);
		this.keyboardShortcuts = {
			n: this.nextSub.bind(this),
			p: this.prevSub.bind(this),
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

	nextSub() {
		const { subscriptionIds, selectedSubscriptionId, selectSub } = this.props;
		if (selectedSubscriptionId === ALL_SUBSCRIPTION && subscriptionIds[0]) {
			selectSub(subscriptionIds[0]);
			return;
		}

		const currentIndex = subscriptionIds.indexOf(selectedSubscriptionId);
		if (currentIndex >= 0 && currentIndex + 1 < subscriptionIds.length) {
			selectSub(subscriptionIds[currentIndex + 1]);
		} else if (currentIndex + 1 === subscriptionIds.length) {
			selectSub(ALL_SUBSCRIPTION);
		}
	}

	prevSub() {
		const { subscriptionIds, selectedSubscriptionId, selectSub } = this.props;

		const currentIndex = subscriptionIds.indexOf(selectedSubscriptionId);
		if (currentIndex === 0) {
			selectSub(ALL_SUBSCRIPTION);
		} else if (currentIndex >= 0 && currentIndex - 1 >= 0) {
			selectSub(subscriptionIds[currentIndex - 1]);
		}
	}
	render() {
		return (
			<div id="sub-list">
				<AllSubListItem />
				{this.props.subscriptionIds.map(
					id => {
						return <SubListItem id={id} key={id} />
					}
				)}
			</div>
		);
	}
};

function mapStateToProps(state) {
	const showUnread = getShowFilter(state) === SHOW_UNREAD;
	return {
		subscriptionIds: showUnread ?
			getUnreadSubscriptionIds(state) :
			getAllSubscriptionIds(state),
		selectedSubscriptionId: getSelectedSub(state),
	};
}

const mapDispatchToProps = {
	selectSub
}

export default connect(mapStateToProps, mapDispatchToProps)(SubList);

