import { NDKEvent } from '@nostr-dev-kit/ndk';
import { HeartIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

import { cn } from '@/shared/utils';

import { usePinLikeBtn } from './hooks';

export const PinLikeBtn = ({ event, inView }: { event: NDKEvent; inView: boolean }) => {
  const { count, isLikedByMe, like } = usePinLikeBtn(inView ? event : undefined);

  return (
    <>
      <Button
        variant="link"
        size="icon"
        className={cn(isLikedByMe ? 'text-red-600' : 'opacity-50 hover:opacity-100')}
        onClick={like}
      >
        <div>
          <HeartIcon size={18} />
        </div>

        <span className="ml-1 text-xs">{count < 1000 ? count : '1K+'}</span>
      </Button>
    </>
  );
};
