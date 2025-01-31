import { Button } from '@/shared/components/ui/button';

import { Spinner } from '@/shared/components/spinner';

import { NewPinWidget } from '@/features/new-pin-widget';
import { PinWidget } from '@/features/pin-widget';

import { usePinsFeedWidget } from './hooks';

export const PinsFeedWidget = () => {
  const { events, hasMore, loadMore, isLoading } = usePinsFeedWidget();

  return (
    <>
      <div className="w-full h-full overflow-y-auto">
        <div className="py-2">
          <NewPinWidget />
        </div>

        {isLoading ? (
          <Spinner />
        ) : events ? (
          <div className="pt-2 flex flex-col gap-2">
            {events.map((event) => (
              <PinWidget pinEvent={event} />
            ))}
          </div>
        ) : (
          <div className="pt-2 px-2">
            <p>No pins found. Follow some users to see their pins here.</p>
          </div>
        )}

        {hasMore && (
          <div className="py-4 flex justify-center">
            <Button variant="secondary" onClick={() => loadMore(100)} className="w-full">
              Load more
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
