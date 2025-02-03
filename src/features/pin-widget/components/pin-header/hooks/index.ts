import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk, useRealtimeProfile } from 'nostr-hooks';
import { naddrEncode } from 'nostr-tools/nip19';
import { useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useCopyToClipboard } from 'usehooks-ts';

import { useToast } from '@/shared/components/ui/use-toast';

export const usePinHeader = (event: NDKEvent) => {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const [, copy] = useCopyToClipboard();

  const { profile } = useRealtimeProfile(inView ? event.pubkey : undefined);

  const navigate = useNavigate();

  const { ndk } = useNdk();
  const { activeUser } = useActiveUser();

  const { toast } = useToast();

  const naddr = useMemo(
    () =>
      naddrEncode({
        identifier: event.tagAddress(),
        kind: event.kind || 39700,
        pubkey: event.pubkey,
        relays: event.onRelays.map((relay) => relay.url),
      }),
    [event],
  );

  const deletePin = useCallback(
    (pinEvent: NDKEvent) => {
      if (!ndk || !ndk.signer) {
        return;
      }

      const e = new NDKEvent(ndk);
      e.kind = 5;
      e.tags = [
        ['e', pinEvent.id],
        ['a', pinEvent.tagAddress()],
        ['k', '39700'],
        ['k', '39700'],
      ];

      e.publish()
        .then((relaySet) => {
          if (relaySet.size === 0) {
            toast({
              title: 'Error',
              description: 'Failed to delete pin',
              variant: 'destructive',
            });
          }
        })
        .catch((_) => {
          toast({
            title: 'Error',
            description: 'Failed to delete pin',
            variant: 'destructive',
          });
        });
    },
    [ndk, toast],
  );

  return {
    ref,
    profile,
    copy,
    navigate,
    naddr,
    deletePin,
    activeUser,
  };
};
