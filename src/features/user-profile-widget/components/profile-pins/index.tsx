import { NDKUser } from '@nostr-dev-kit/ndk';
import { memo } from 'react';

import { Button } from '@/shared/components/ui/button';

import { PinWidget } from '@/features/pin-widget';

import { useProfilePins } from './hooks';

export const ProfilePins = memo(
  ({ user }: { user: NDKUser }) => {
    const { sortedEvents, loadMore, hasMore, isLoading } = useProfilePins({
      user,
    });

    return (
      <>
        <div>{sortedEvents?.map((event) => <PinWidget key={event.id} pinEvent={event} />)}</div>

        {hasMore && (
          <div className="py-4 flex justify-center">
            <Button
              variant="secondary"
              onClick={() => loadMore(50)}
              className="w-full"
              disabled={isLoading}
            >
              Load more
            </Button>
          </div>
        )}
      </>
    );
  },
  (prev, next) => prev.user.pubkey === next.user.pubkey,
);
