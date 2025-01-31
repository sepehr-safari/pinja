import { NDKKind, NDKUser } from '@nostr-dev-kit/ndk';
import { useSubscription } from 'nostr-hooks';
import { useEffect } from 'react';

export const useProfilePins = ({ user }: { user: NDKUser }) => {
  const subId = `user-pins-${user.pubkey}`;

  const { events, createSubscription, loadMore, hasMore, isLoading } = useSubscription(subId);

  useEffect(() => {
    if (!user.pubkey) {
      return;
    }

    createSubscription({
      filters: [{ authors: [user.pubkey], kinds: [39700 as NDKKind], limit: 50 }],
      opts: { groupableDelay: 500 },
    });
  }, [createSubscription, user.pubkey]);

  return { events, loadMore, hasMore, isLoading };
};
