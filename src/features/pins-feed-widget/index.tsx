import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

import { Spinner } from '@/shared/components/spinner';

import { NewPinWidget } from '@/features/new-pin-widget';
import { PinWidget } from '@/features/pin-widget';

import { usePinsFeedWidget } from './hooks';
import { PinFeedView } from './types';

export const PinsFeedWidget = () => {
  const { sortedEvents, hasMore, loadMore, isLoading, setView, view, activeUser } =
    usePinsFeedWidget();

  return (
    <>
      <div className="w-full h-full overflow-y-auto">
        {activeUser && (
          <>
            <div className="py-2">
              <NewPinWidget />
            </div>

            <div className="px-2">
              <div className="p-2 border rounded-sm shadow-md">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {view === 'Following' ? 'Following' : 'Global'}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start">
                    <DropdownMenuRadioGroup
                      value={view}
                      onValueChange={(v) => setView(v as PinFeedView)}
                    >
                      <DropdownMenuRadioItem value="Global">Global</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Following">Following</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </>
        )}

        {isLoading ? (
          <Spinner />
        ) : sortedEvents ? (
          <div className="">
            {sortedEvents.map((event) => (
              <PinWidget pinEvent={event} />
            ))}
          </div>
        ) : (
          <div className="pt-2 px-2">
            <p>No pins found</p>
          </div>
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
