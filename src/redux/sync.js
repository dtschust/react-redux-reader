import _ from 'lodash';

import { apiFetchFeedItemsByIds, apiFetchAllUnreadIds, apiFetchLastNDaysOfFeedItems } from '../feed-wrangler-api';
import { updateSyncingState } from './reducers/app-state-store';
import { fetchSubscriptions } from './reducers/subscriptions-store';
import { addFeedItems, getAllFeedItemIds, deleteFeedItemsById } from './reducers/feed-items-store';


export default function sync() {
	return (dispatch, getState) => {
		const state = getState();
		dispatch(updateSyncingState(true));

		const knownFeedItemIds = getAllFeedItemIds(state);

		const unreadIdsPromise = apiFetchAllUnreadIds();

		const fetchAllPromise = apiFetchLastNDaysOfFeedItems(3);

		const subscriptionsPromise = dispatch(fetchSubscriptions());

		Promise.all([unreadIdsPromise, fetchAllPromise, subscriptionsPromise]).then(([unreadIds, allStories]) => {
			dispatch(addFeedItems(allStories));

			const idsToFetch = _.uniq(
				_.difference(
					_.uniq(knownFeedItemIds.concat(unreadIds)),
					_.map(allStories, ({feed_item_id}) => feed_item_id.toString()),
				)
			)

			const fetchedIds = [];
			const fetches = _.chunk(idsToFetch, 100).map((ids) => {
				return apiFetchFeedItemsByIds(ids).then((feedItems) => {
					fetchedIds.push(..._.map(feedItems, ({ feed_item_id }) => feed_item_id.toString()));
					dispatch(addFeedItems(feedItems));
				});
			});
			Promise.all(fetches).then(() => {
				// ids not returned by the API are dead: either they're so old feed wrangler
				// forgot about them, or we unsubscribed from the relevant feed. Regardless,
				// cull them.
				const deadIds = _.difference(idsToFetch, fetchedIds);
				if (deadIds.length) {
					dispatch(deleteFeedItemsById(deadIds));
				}
				dispatch(updateSyncingState(false));
			})
		});
	}
}