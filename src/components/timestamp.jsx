import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { getTimestampNonce } from '../redux/reducers/app-state-store';

function BaseTimestamp({ time, approximate, style }) {
	if (approximate) {
		return (
			<span style={style}>about {moment(time).fromNow()}</span>
		)
	}

	return (
		<span style={style}>{ moment(time).calendar() }</span>
	)

}

function mapStateToProps(state, props) {
	return {
		...props,
		nonce: getTimestampNonce(state),
	};
}

export default connect(mapStateToProps)(BaseTimestamp);