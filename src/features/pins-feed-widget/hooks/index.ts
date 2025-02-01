import { NDKKind } from '@nostr-dev-kit/ndk';
import { useActiveUser, useFollows, useSubscription } from 'nostr-hooks';
import { useEffect, useMemo } from 'react';

export const usePinsFeedWidget = () => {
  const { activeUser } = useActiveUser();

  const { follows } = useFollows({ pubkey: activeUser?.pubkey });

  const subId =
    activeUser === undefined
      ? undefined
      : activeUser === null
        ? 'pins-feed-explore'
        : `pins-feed-${activeUser.pubkey}`;

  const { createSubscription, events, loadMore, hasMore, isLoading } = useSubscription(subId);

  const sortedEvents = useMemo(
    () =>
      events === undefined ? undefined : [...events].sort((a, b) => b.created_at! - a.created_at!),
    [events],
  );

  useEffect(() => {
    if (activeUser === undefined) {
      return;
    } else if (activeUser === null) {
      createSubscription({
        filters: [
          {
            kinds: [39700 as NDKKind],
            limit: 10,
          },
        ],
        opts: { groupableDelay: 500 },
      });
    } else {
      activeUser &&
        follows !== undefined &&
        createSubscription({
          filters: [
            {
              kinds: [39700 as NDKKind],
              limit: 10,
              authors: [activeUser.pubkey, ...(follows || []).map((u) => u.pubkey)],
            },
          ],
          opts: { groupableDelay: 500 },
        });
    }
  }, [createSubscription, follows, activeUser]);

  return { sortedEvents, loadMore, hasMore, isLoading };
};
