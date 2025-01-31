import { useActiveUser, useSubscription } from 'nostr-hooks';
import { decode } from 'nostr-tools/nip19';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Spinner } from '@/shared/components/spinner';

import { PinWidget } from '@/features/pin-widget';

export const PinEditorPage = () => {
  const { activeUser } = useActiveUser();

  const { pinId } = useParams();

  const subId = `pin-${pinId}`;

  const { createSubscription, events } = useSubscription(subId);

  useEffect(() => {
    if (!pinId) {
      return;
    }

    const { data, type } = decode(pinId);

    if (type === 'naddr') {
      const { identifier, kind, pubkey, relays } = data;
      const dTag = identifier.split(':')[2];

      createSubscription({
        filters: [
          {
            authors: [pubkey],
            kinds: [kind],
            '#d': [dTag],
          },
        ],
        relayUrls: relays,
      });
    }
  }, [pinId]);

  if (events === undefined) {
    return <Spinner />;
  }

  if (events === null || events.length === 0) {
    return <div className="p-2">Pin not found</div>;
  }

  if (activeUser?.pubkey !== events[0].pubkey) {
    return <div className="p-2">You are not the author of this pin</div>;
  }

  return (
    <div className="pt-2 h-full w-full overflow-y-auto">
      <PinWidget pinEvent={events[0]} editMode />
    </div>
  );
};
