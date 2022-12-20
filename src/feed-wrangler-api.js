import _ from 'lodash';

import { purgePersistor } from './redux/configure-store';

const API_ENDPOINT = 'https://drews-little-helpers.herokuapp.com/v2';

const ACCESS_TOKEN = localStorage.getItem('accessToken');

export function apiAuth(email, password) {
	let url = `${API_ENDPOINT}/authentication.json`;
	const headers = new Headers();
	headers.set('Authorization', 'Basic ' + btoa(email + ":" + password));
	headers.set('Credentials', 'include');
	fetch(url, { headers })
		.then(() => {
			console.log('success!');
			localStorage.setItem('accessToken', 'Basic ' + btoa(email + ":" + password));
			window.location.reload();
		});
}

export function logout() {
	localStorage.removeItem('accessToken');
	purgePersistor().then(() => {
		window.location.reload();
	});
}

export function apiFetchFeedItems(limit, offset, options = {}) {
	return Promise.resolve([]);
}

export function apiUpdateFeedItem(id, options = {}) {
	// Fake version for testing
	return Promise.resolve({
		result: 'success',
	});
}

export function apiFetchSubscriptions() {
	// TODO:
	return Promise.resolve([]);
	// const url = `${API_ENDPOINT}/subscriptions/list?access_token=${ACCESS_TOKEN}`;

	// return fetch(url).then(response => response.json());
}

export function apiFetchFeedItemsByIds(ids) {
	return Promise.resolve([]);
}

export function apiFetchAllUnreadIds(offset = 0) {
	return Promise.resolve([]);
}

export function apiFetchLastNDaysOfFeedItems(numDays, offset = 0) {
	return Promise.resolve([]);
}
