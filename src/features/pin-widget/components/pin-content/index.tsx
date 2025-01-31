import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';
import { naddrEncode } from 'nostr-tools/nip19';

const parsePinEvent = (pinEvent: NDKEvent) => {
  const url =
    pinEvent.content.startsWith('http://') || pinEvent.content.startsWith('https://')
      ? pinEvent.content
      : `https://${pinEvent.content}`;

  const tTags = pinEvent.getMatchingTags('t');
  const hashtags = tTags
    .map((tTag) => (tTag.length > 1 ? tTag[1] : null))
    .filter((t) => t !== null);

  return {
    url,
    hashtags,
  };
};

export const PinContent = ({ event, editMode }: { event: NDKEvent; editMode?: boolean }) => {
  const parsedPinEvent = useMemo(() => parsePinEvent(event), [event]);

  const [content, setContent] = useState<string>(parsedPinEvent.url);

  const { ndk } = useNdk();

  const { toast } = useToast();

  const navigate = useNavigate();

  const update = useCallback(
    (event: NDKEvent) => {
      if (!event || !ndk || !ndk.signer) {
        return;
      }

      if (content.length === 0 || (!content.startsWith('http') && !content.startsWith('www'))) {
        toast({
          title: 'Invalid URL',
          description: 'URL must start with http or www',
          variant: 'destructive',
        });
        return;
      }

      const e = new NDKEvent(ndk);
      e.kind = event.kind;
      e.dTag = event.dTag;
      e.content = content;

      e.publish()
        .then((relaySet) => {
          if (relaySet.size === 0) {
            toast({
              title: 'Error',
              description: 'Failed to update pin',
              variant: 'destructive',
            });
          } else {
            const naddr = naddrEncode({
              identifier: event.tagAddress(),
              kind: event.kind || 39700,
              pubkey: event.pubkey,
              relays: event.onRelays.map((relay) => relay.url),
            });

            navigate(`/pin/${naddr}`);
          }
        })
        .catch((_) => {
          toast({
            title: 'Error',
            description: 'Failed to update pin',
            variant: 'destructive',
          });
        });
    },
    [ndk, content, toast],
  );

  return (
    <>
      {editMode ? (
        <>
          <div className="flex flex-col gap-2">
            <Input
              className="bg-background"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="https://"
            />

            <div className="w-full flex gap-2 justify-end">
              <Button className="px-8" size="sm" onClick={() => update(event)}>
                Update Pin
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <Button variant="link" className="p-0">
            <a href={parsedPinEvent?.url} target="_blank" rel="noopener noreferrer">
              {parsedPinEvent?.url}
            </a>
          </Button>
        </>
      )}
    </>
  );
};
