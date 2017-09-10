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

export function apiUpdateFeedItem() {

};

export function apiFetchSubscriptions() {
	let url = `${API_ENDPOINT}/subscriptions/list?access_token=${ACCESS_TOKEN}`;

	return fetch(url).then(response => response.json());
};
