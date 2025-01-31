import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useActiveUser, useSubscription } from 'nostr-hooks';
import { useCallback, useEffect, useMemo } from 'react';

export const usePinRepostBtn = (event: NDKEvent | undefined) => {
  const { count } = useAnybodyReposts(event);

  const { isRepostedByMe } = useMyRepost(event);

  const repost = useCallback(() => !isRepostedByMe && event?.repost(), [event, isRepostedByMe]);

  return { count, isRepostedByMe, repost };
};

const useMyRepost = (event: NDKEvent | undefined) => {
  const { activeUser } = useActiveUser();

  const subId = activeUser && event ? `pin-my-reposts-${event.tagAddress()}` : undefined;

  const { createSubscription, events } = useSubscription(subId);

  useEffect(() => {
    activeUser &&
      event &&
      createSubscription({
        filters: [
          {
            kinds: [NDKKind.Repost],
            '#a': [event.tagAddress()],
            authors: [activeUser.pubkey],
            limit: 1,
          },
        ],
        opts: { groupableDelay: 500 },
      });
  }, [createSubscription, activeUser, event]);

  return { isRepostedByMe: events && events.length > 0 };
};

const useAnybodyReposts = (event: NDKEvent | undefined) => {
  const subId = event ? `pin-reposts-${event.tagAddress()}` : undefined;

  const { createSubscription, events } = useSubscription(subId);

  const count = useMemo(() => events?.length || 0, [events]);

  useEffect(() => {
    event &&
      createSubscription({
        filters: [{ kinds: [NDKKind.Repost], '#a': [event.tagAddress()], limit: 100 }],
        opts: { groupableDelay: 500 },
      });
  }, [createSubscription, event]);

  return { count };
};
