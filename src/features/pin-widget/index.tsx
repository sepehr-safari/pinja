import { NDKEvent } from '@nostr-dev-kit/ndk';

import { Card } from '@/shared/components/card';

import { PinContent, PinFooter, PinHeader } from './components';

export const PinWidget = ({ pinEvent }: { pinEvent: NDKEvent }) => {
  return (
    <>
      <Card>
        <PinHeader event={pinEvent} />
        <PinContent event={pinEvent} />
        <PinFooter event={pinEvent} />
      </Card>
    </>
  );
};
