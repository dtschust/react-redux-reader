import _ from 'lodash';

import { apiFetchFeedItemsByIds, apiFetchAllUnreadIds, apiFetchLastNDaysOfFeedItems } from '../feed-wrangler-api';
import { updateSyncingState } from './reducers/app-state-store';
import { fetchSubscriptions } from './reducers/subscriptions-store';
import { addFeedItems, getAllFeedItemIds } from './reducers/feed-items-store';


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
					_.map(knownFeedItemIds.concat(unreadIds), 'feed_item_id'),
					_.map(allStories, 'feed_item_id'),
				)
			)

			const fetches = _.chunk(idsToFetch, 100).map((ids) => {
				return apiFetchFeedItemsByIds(ids).then((feedItems) => {
					dispatch(addFeedItems(feedItems));
				});
			});
			Promise.all(fetches).then(() => {
				dispatch(updateSyncingState(false));
			})
		});
	}
}