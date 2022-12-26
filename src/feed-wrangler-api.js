import _ from 'lodash';

import { purgePersistor } from './redux/configure-store';

const API_ENDPOINT = 'https://drews-little-helpers.herokuapp.com/v2';

const ACCESS_TOKEN = localStorage.getItem('accessToken');

function apiFetch(endpoint, options) {
	const headers = new Headers();
	headers.set('Authorization', ACCESS_TOKEN);
	headers.set('Content-Type', 'application/json');
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
	const params = new URLSearchParams();

	// TODO: offset support
	// if (offset) {
	// 	url += `&offset=${offset}`;
	// }

	if (!_.isUndefined(options.read)) {
		params.set('read', options.read);
	}

	if (!_.isUndefined(options.feedId)) {
		return apiFetch(`feeds/${options.feedId}/entries.json?${params.toString()}`);
	}

	return apiFetch(`entries.json?${params.toString()}`);
}

export function apiUpdateFeedItem(id, options = {}) {
	if (!_.isUndefined(options.read)) {
		return apiFetch(`unread_entries.json`, {
			method: options.read ? 'DELETE' : 'POST',
			body: JSON.stringify({ unread_entries: [ id ] })
		}).then(() => ({ result: 'success' }));
	}

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
	return apiFetch('unread_entries.json');
}

export function apiFetchLastNDaysOfFeedItems(numDays, page = 1) {
	const params = new URLSearchParams();
	params.set('since', new Date(1000 * (Math.floor(Date.now() / 1000) - numDays * 60 * 60 * 24)).toISOString())
	params.set('page', page);

	return apiFetch(`entries.json?${params.toString()}`)
		.catch(() => ([])) // we get a 404 if the new page doesn't exist
		.then((feedItems) => {
			if (feedItems && feedItems.length === 100) {
				// fetch more
				return apiFetchLastNDaysOfFeedItems(
					numDays,
					page + 1,
				).then(newFeedItems => {
					return feedItems.concat(newFeedItems);
				});
			}
			return feedItems;
		});
}
