import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useSubscription } from 'nostr-hooks';
import { useEffect } from 'react';

export const usePinCommentsWidget = (event: NDKEvent) => {
  const subId = `pin-comments-${event.tagAddress()}`;

  const { createSubscription, events, loadMore, hasMore, isLoading } = useSubscription(subId);

  useEffect(() => {
    event &&
      createSubscription({
        filters: [{ kinds: [1], '#a': [event.tagAddress()], limit: 10 }],
        opts: { groupableDelay: 500 },
      });
  }, [createSubscription, event]);

  return {
    events,
    loadMore,
    hasMore,
    isLoading,
  };
};
