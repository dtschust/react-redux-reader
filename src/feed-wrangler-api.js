import _ from 'lodash';

const API_ENDPOINT = 'http://fw-proxy.herokuapp.com/api/v2';

const ACCESS_TOKEN = localStorage.getItem('accessToken');

export function apiFetchFeedItems(limit, offset, options = {}) {
	let url = `${API_ENDPOINT}/feed_items/list?access_token=${ACCESS_TOKEN}`;

	if (limit) {
		url += `&limit=${limit}`;
	}

	if (offset) {
		url += `&offset=${offset}`;
	}

	if (!_.isUndefined(options.read)) {
		url += `&read=${options.read}`;
	}

	if (!_.isUndefined(options.starred)) {
		url += `&starred=${options.starred}`;
	}

	if (!_.isUndefined(options.feedId)) {
		url += `&feed_id=${options.feedId}`;
	}

	return fetch(url).then(response => response.json());
};

export function apiUpdateFeedItem(id, options = {}) {
	let url = `${API_ENDPOINT}/feed_items/update?access_token=${ACCESS_TOKEN}&feed_item_id=${id}`;

	if (!_.isUndefined(options.read)) {
		url += `&read=${options.read}`;
	}

	return fetch(url, { method: 'post' }).then(response => response.json());

	// Fake version for testing
	// return Promise.resolve({
	// 	result: 'success',
	// });
};

export function apiFetchSubscriptions() {
	const url = `${API_ENDPOINT}/subscriptions/list?access_token=${ACCESS_TOKEN}`;

	return fetch(url).then(response => response.json());
};
