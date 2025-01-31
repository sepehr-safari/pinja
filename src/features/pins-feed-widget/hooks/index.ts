import { NDKKind } from '@nostr-dev-kit/ndk';
import { useActiveUser, useFollows, useSubscription } from 'nostr-hooks';
import { useEffect } from 'react';

export const usePinsFeedWidget = () => {
  const { activeUser } = useActiveUser();

  const { follows } = useFollows({ pubkey: activeUser?.pubkey });

  const subId = activeUser ? `pins-feed-${activeUser.pubkey}` : undefined;

  const { createSubscription, events, loadMore, hasMore, isLoading } = useSubscription(subId);

  useEffect(() => {
    if (!activeUser || follows === undefined) {
      return;
    }

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
  }, [createSubscription, follows, activeUser]);

  return { events, loadMore, hasMore, isLoading };
};
