// import _ from 'lodash';

import { purgePersistor } from './redux/configure-store';

const API_ENDPOINT = 'https://drews-little-helpers.herokuapp.com/v2';

const ACCESS_TOKEN = localStorage.getItem('accessToken');

function apiFetch(endpoint, options) {
	const headers = new Headers();
	headers.set('Authorization', ACCESS_TOKEN);
	return fetch(`${API_ENDPOINT}/${endpoint}`, { headers, ...options })
		.then(resp=>resp.json());
}

export function apiAuth(email, password) {
	let url = `${API_ENDPOINT}/authentication.json`;
	const headers = new Headers();
	headers.set('Authorization', 'Basic ' + btoa(email + ":" + password));
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
	return apiFetch('entries.json');
}

export function apiUpdateFeedItem(id, options = {}) {
	// Fake version for testing
	return Promise.resolve({
		result: 'success',
	});
}

export function apiFetchSubscriptions() {
	return apiFetch('subscriptions.json').then((feeds)=>({ feeds }));
}

export function apiFetchFeedItemsByIds(ids) {
	return apiFetch(`entries.json?ids=${ids.join(',')}`);
}

export function apiFetchAllUnreadIds(offset = 0) {
	// TODO: pagination, truly do "all"
	return apiFetch('unread_entries.json');
}

export function apiFetchLastNDaysOfFeedItems(numDays, offset = 0) {
	return Promise.resolve([]);
}
