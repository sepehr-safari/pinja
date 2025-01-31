import { NDKEvent } from '@nostr-dev-kit/ndk';
import { Repeat2Icon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

import { cn } from '@/shared/utils';

import { usePinRepostBtn } from './hooks';

export const PinRepostBtn = ({ event, inView }: { event: NDKEvent; inView: boolean }) => {
  const { count, isRepostedByMe, repost } = usePinRepostBtn(inView ? event : undefined);

  return (
    <>
      <Button
        variant="link"
        size="icon"
        className={cn(isRepostedByMe ? 'text-green-600' : 'opacity-50 hover:opacity-100')}
        onClick={repost}
      >
        <div>
          <Repeat2Icon size={18} />
        </div>

        <span className="ml-1 text-xs">{count < 100 ? count : '100+'}</span>
      </Button>
    </>
  );
};
