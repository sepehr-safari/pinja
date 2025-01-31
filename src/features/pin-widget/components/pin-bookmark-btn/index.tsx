import { NDKEvent } from '@nostr-dev-kit/ndk';
import { BookmarkIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

import { cn } from '@/shared/utils';

import { usePinBookmarkBtn } from './hooks';

export const PinBookmarkBtn = ({ event, inView }: { event: NDKEvent; inView: boolean }) => {
  const { isBookmarkedByMe, bookmark, unbookmark } = usePinBookmarkBtn(inView ? event : undefined);

  return (
    <>
      <Button
        variant="link"
        size="icon"
        className={cn(isBookmarkedByMe ? 'text-green-600' : 'opacity-50 hover:opacity-100')}
        onClick={isBookmarkedByMe ? unbookmark : bookmark}
      >
        <BookmarkIcon size={18} />
      </Button>
    </>
  );
};
