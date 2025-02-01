import { NDKKind, NDKUser } from '@nostr-dev-kit/ndk';
import { useSubscription } from 'nostr-hooks';
import { useEffect, useMemo } from 'react';

export const useProfilePins = ({ user }: { user: NDKUser }) => {
  const subId = `user-pins-${user.pubkey}`;

  const { events, createSubscription, loadMore, hasMore, isLoading } = useSubscription(subId);

  const sortedEvents = useMemo(
    () =>
      events === undefined ? undefined : [...events].sort((a, b) => b.created_at! - a.created_at!),
    [events],
  );

  useEffect(() => {
    if (!user.pubkey) {
      return;
    }

    createSubscription({
      filters: [{ authors: [user.pubkey], kinds: [39700 as NDKKind], limit: 50 }],
      opts: { groupableDelay: 500 },
    });
  }, [createSubscription, user.pubkey]);

  return { sortedEvents, loadMore, hasMore, isLoading };
};
