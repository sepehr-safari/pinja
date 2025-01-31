import { NDKEvent } from '@nostr-dev-kit/ndk';
import { ZapIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

import { cn } from '@/shared/utils';

import { ZapWidget } from '@/features/zap-widget';

import { usePinZapBtn } from './hooks';

export const PinZapBtn = ({ event, inView }: { event: NDKEvent; inView: boolean }) => {
  const { totalAmount, isZapedByMe } = usePinZapBtn(inView ? event : undefined);

  return (
    <>
      <ZapWidget target={inView ? event : undefined}>
        <Button
          variant="link"
          size="icon"
          className={cn(isZapedByMe ? 'text-orange-600' : 'opacity-50 hover:opacity-100')}
        >
          <div>
            <ZapIcon size={18} />
          </div>

          <span className="ml-1 text-xs">{totalAmount < 1000 ? totalAmount : '1K+'}</span>
        </Button>
      </ZapWidget>
    </>
  );
};
