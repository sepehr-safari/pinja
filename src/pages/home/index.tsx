import { useActiveUser } from 'nostr-hooks';

import { PinsFeedWidget } from '@/features/pins-feed-widget';

export const HomePage = () => {
  const { activeUser } = useActiveUser();

  return (
    <>
      {activeUser ? (
        <PinsFeedWidget />
      ) : (
        <div className="flex flex-col h-full w-full items-center justify-center">
          <h3>Welcome to Pinja!</h3>
          <p>Log-in to view and create notes</p>
        </div>
      )}
    </>
  );
};
