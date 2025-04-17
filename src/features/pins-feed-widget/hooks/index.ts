import { NDKKind } from '@nostr-dev-kit/ndk';
import { useActiveUser, useFollows, useSubscription } from 'nostr-hooks';
import { useEffect, useMemo, useState } from 'react';

import { PinFeedView } from '../types';

export const usePinsFeedWidget = () => {
  const [view, setView] = useState<PinFeedView>('Global');

  const { activeUser } = useActiveUser();

  const { follows } = useFollows({ pubkey: activeUser?.pubkey });

  const subId =
    activeUser === undefined
      ? undefined
      : activeUser === null
        ? 'pins-feed-global'
        : follows === undefined
          ? undefined
          : view === 'Following'
            ? `pins-feed-${activeUser.pubkey}`
            : 'pins-feed-global';

  const { createSubscription, events, loadMore, hasMore, isLoading } = useSubscription(subId);

  const sortedEvents = useMemo(
    () =>
      events === undefined ? undefined : [...events].sort((a, b) => b.created_at! - a.created_at!),
    [events],
  );

  useEffect(() => {
    if (activeUser && follows) {
      setView('Following');
    } else {
      setView('Global');
    }
  }, [follows, activeUser, setView]);

  useEffect(() => {
    if (activeUser === undefined) {
      return;
    } else if (activeUser === null) {
      createSubscription({
        filters: [
          {
            kinds: [39700 as NDKKind],
            limit: 50,
          },
          {
            kinds: [39701 as NDKKind],
            limit: 50,
          },
        ],
        opts: { groupableDelay: 500 },
      });
    } else if (follows === undefined) {
      return;
    } else if (view === 'Following') {
      createSubscription({
        filters: [
          {
            kinds: [39700 as NDKKind],
            limit: 50,
            authors: [activeUser.pubkey, ...(follows || []).map((u) => u.pubkey)],
          },
          {
            kinds: [39701 as NDKKind],
            limit: 50,
            authors: [activeUser.pubkey, ...(follows || []).map((u) => u.pubkey)],
          },
        ],
        opts: { groupableDelay: 500 },
      });
    } else {
      createSubscription({
        filters: [
          {
            kinds: [39700 as NDKKind],
            limit: 50,
          },
          {
            kinds: [39701 as NDKKind],
            limit: 50,
          },
        ],
        opts: { groupableDelay: 500 },
      });
    }
  }, [createSubscription, follows, activeUser, view]);

  return { sortedEvents, loadMore, hasMore, isLoading, view, setView, activeUser };
};
