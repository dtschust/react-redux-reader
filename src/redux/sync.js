import _ from 'lodash';

import {
	apiFetchFeedItemsByIds,
	apiFetchAllUnreadIds,
	apiFetchLastNDaysOfFeedItems,
} from '../feed-wrangler-api';
import { updateSyncingState } from './reducers/app-state-store';
import { fetchSubscriptions } from './reducers/subscriptions-store';
import {
	getAllFeedItems,
	addFeedItems,
	setAllUnreadIds,
	getAllFeedItemIds,
	deleteFeedItemsById,
} from './reducers/feed-items-store';

function pruneOldReadPosts() {
	return (dispatch, getState) => {
		// TODO: implement
		return;
		const state = getState();
		const now = Date.now() / 1000;
		const tenDaysAgo = now - 10 * 60 * 60 * 24;

		const allFeedItems = getAllFeedItems(state);
		const idsToRemove = _(allFeedItems)
			.filter(feedItem => {
				if (feedItem.read && feedItem.published_at < tenDaysAgo) {
					return true;
				}

				return false;
			})
			.map(({ id }) => id.toString())
			.value();

		if (idsToRemove.length) {
			dispatch(deleteFeedItemsById(idsToRemove));
		}
	};
}

export default function sync() {
	return (dispatch, getState) => {
		const state = getState();
		dispatch(updateSyncingState(true));

		const knownFeedItemIds = getAllFeedItemIds(state);

		const unreadIdsPromise = apiFetchAllUnreadIds();

		const fetchAllPromise = apiFetchLastNDaysOfFeedItems(3);

		const subscriptionsPromise = dispatch(fetchSubscriptions());

		Promise.all([
			unreadIdsPromise,
			fetchAllPromise,
			subscriptionsPromise,
		]).then(([unreadIds, allStories]) => {
			dispatch(addFeedItems(allStories));
			dispatch(setAllUnreadIds(unreadIds.reduce((acc, id)=>{
				acc[id] = true;
				return acc;
			}, {})));

			const idsToFetch = _.uniq(
				_.difference(
					_.uniq(knownFeedItemIds.concat(unreadIds)),
					_.map(allStories, ({ id }) => id.toString()),
				),
			);

			const fetchedIds = [];
			const fetches = _.chunk(idsToFetch, 100).map(ids => {
				return apiFetchFeedItemsByIds(ids).then(feedItems => {
					fetchedIds.push(
						..._.map(feedItems, ({ id }) => id.toString()),
					);
					dispatch(addFeedItems(feedItems));
				});
			});
			Promise.all(fetches).then(() => {
				// ids not returned by the API are dead: either they're so old feed wrangler
				// forgot about them, or we unsubscribed from the relevant feed. Regardless,
				// cull them.

				// TODO: Fixme
				// const deadIds = _.difference(idsToFetch, fetchedIds);
				// if (deadIds.length) {
				// 	dispatch(deleteFeedItemsById(deadIds));
				// }

				dispatch(pruneOldReadPosts());
				dispatch(updateSyncingState(false));
			});
		});
	};
}
