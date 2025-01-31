import { NDKEvent } from '@nostr-dev-kit/ndk';

import { Button } from '@/shared/components/ui/button';

import { Spinner } from '@/shared/components/spinner';

import { NewPinCommentWidget } from '@/features/new-pin-comment-widget';
import { NoteByNoteId } from '@/features/note-widget';

import { usePinCommentsWidget } from './hooks';

export const PinCommentsWidget = ({ event }: { event: NDKEvent }) => {
  const { events, hasMore, loadMore } = usePinCommentsWidget(event);

  return (
    <>
      <NewPinCommentWidget pinEvent={event} />

      <div className="-mx-2">
        {events === undefined ? (
          <Spinner />
        ) : (
          events.length > 0 && (
            <div className="pt-2 flex flex-col gap-2">
              {events.map((event) => (
                <NoteByNoteId key={event.id} noteId={event.id} />
              ))}
            </div>
          )
        )}

        {hasMore && (
          <div className="py-4 flex justify-center">
            <Button variant="secondary" onClick={() => loadMore(50)} className="w-full">
              Load more
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
