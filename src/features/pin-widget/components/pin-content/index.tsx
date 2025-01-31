import { Button } from '@/shared/components/ui/button';
import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useMemo } from 'react';

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

export const PinContent = ({ event }: { event: NDKEvent }) => {
  const parsedPinEvent = useMemo(() => parsePinEvent(event), [event]);

  return (
    <>
      <Button variant="link" className="p-0">
        <a href={parsedPinEvent?.url} target="_blank" rel="noopener noreferrer">
          {parsedPinEvent?.url}
        </a>
      </Button>
    </>
  );
};
