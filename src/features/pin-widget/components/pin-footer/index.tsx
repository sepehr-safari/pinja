import { NDKEvent } from '@nostr-dev-kit/ndk';
import { memo } from 'react';

import { PinCommentsWidget } from '@/features/pin-comments-widget';

import {
  PinBookmarkBtn,
  PinCommentBtn,
  PinLikeBtn,
  PinRepostBtn,
  PinZapBtn,
} from '@/features/pin-widget/components';

import { usePinFooter } from './hooks';

export const PinFooter = memo(
  ({ event }: { event: NDKEvent }) => {
    const { inView, ref, setShowingComments, showingComments } = usePinFooter();

    return (
      <>
        <div className="flex items-center justify-between gap-2" ref={ref}>
          <PinCommentBtn
            onClick={() => setShowingComments((prev) => !prev)}
            event={event}
            inView={inView}
          />

          <PinZapBtn event={event} inView={inView} />

          <PinLikeBtn event={event} inView={inView} />

          <PinRepostBtn event={event} inView={inView} />

          <PinBookmarkBtn event={event} inView={inView} />
        </div>

        {showingComments && (
          <div className="pb-2">
            <PinCommentsWidget event={event} />
          </div>
        )}
      </>
    );
  },
  (prev, next) => prev.event.id === next.event.id,
);
