import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useSubscription } from 'nostr-hooks';
import { useEffect, useMemo } from 'react';

export const usePinCommentBtn = (event: NDKEvent | undefined) => {
  const subId = event ? `pin-comments-${event.tagAddress()}` : undefined;

  const { createSubscription, events } = useSubscription(subId);

  const count = useMemo(() => events?.length || 0, [events]);

  useEffect(() => {
    event &&
      createSubscription({
        filters: [{ kinds: [1111], '#a': [event.tagAddress()], limit: 10 }],
        opts: { groupableDelay: 500 },
      });
  }, [createSubscription, event]);

  return { count };
};
