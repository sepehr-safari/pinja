import { NDKEvent } from '@nostr-dev-kit/ndk';

import { Card } from '@/shared/components/card';

import { PinContent, PinFooter, PinHeader } from './components';

export const PinWidget = ({ pinEvent, editMode }: { pinEvent: NDKEvent; editMode?: boolean }) => {
  return (
    <>
      <Card>
        <PinHeader event={pinEvent} />
        <PinContent event={pinEvent} editMode={editMode} />
        <PinFooter event={pinEvent} />
      </Card>
    </>
  );
};
