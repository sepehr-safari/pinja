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
          <img src="/pinja.png" alt="Pinja logo" className="rounded-full" />

          <h2>Welcome to Pinja</h2>
          <p>Log-in to get started</p>
        </div>
      )}
    </>
  );
};
