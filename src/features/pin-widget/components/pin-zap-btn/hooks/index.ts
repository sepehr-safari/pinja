import { NDKEvent, NDKKind, zapInvoiceFromEvent } from '@nostr-dev-kit/ndk';
import { useActiveUser, useSubscription } from 'nostr-hooks';
import { useEffect, useMemo } from 'react';

export const usePinZapBtn = (event: NDKEvent | undefined) => {
  const { count, totalAmount } = useAnybodyZaps(event);

  const { isZapedByMe } = useMyZap(event);

  return { count, isZapedByMe, totalAmount };
};

const useMyZap = (event: NDKEvent | undefined) => {
  const { activeUser } = useActiveUser();

  const subId = activeUser && event ? `pin-my-zaps-${event.tagAddress()}` : undefined;

  const { createSubscription, events } = useSubscription(subId);

  useEffect(() => {
    activeUser &&
      event &&
      createSubscription({
        filters: [
          {
            kinds: [NDKKind.Zap],
            '#a': [event.tagAddress()],
            authors: [activeUser.pubkey],
            limit: 1,
          },
        ],
        opts: { groupableDelay: 500 },
      });
  }, [createSubscription, activeUser, event]);

  return { isZapedByMe: events && events.length > 0 };
};

const useAnybodyZaps = (event: NDKEvent | undefined) => {
  const subId = event ? `pin-zaps-${event.tagAddress()}` : undefined;

  const { createSubscription, events } = useSubscription(subId);

  const count = useMemo(() => events?.length || 0, [events]);

  const totalAmount = useMemo(
    () =>
      events?.reduce((acc, e) => acc + Math.floor(zapInvoiceFromEvent(e)?.amount || 0) / 1000, 0) ||
      0,
    [events],
  );

  useEffect(() => {
    event &&
      createSubscription({
        filters: [{ kinds: [NDKKind.Zap], '#a': [event.tagAddress()], limit: 1000 }],
        opts: { groupableDelay: 500 },
      });
  }, [createSubscription, event]);

  return { count, totalAmount };
};
