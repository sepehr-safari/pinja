import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk, useSubscription } from 'nostr-hooks';
import { useCallback, useEffect, useMemo } from 'react';

export const usePinBookmarkBtn = (event: NDKEvent | undefined) => {
  const { ndk } = useNdk();

  const { myBookmarkList } = useMyBookmarkList(event !== undefined);

  const isBookmarkedByMe = useMemo(
    () =>
      myBookmarkList
        ?.getMatchingTags('a')
        ?.some((aTag) => aTag.length > 1 && aTag[1] === event?.tagAddress()),
    [myBookmarkList, event],
  );

  const bookmark = useCallback(() => {
    if (!event || !ndk) {
      return;
    }

    if (isBookmarkedByMe) {
      return;
    }

    const e = new NDKEvent(ndk);
    e.kind = 10397 as NDKKind;
    e.tags = [...(myBookmarkList?.tags || [])];
    e.tags.push(['a', event.tagAddress()]);
    e.publish();
  }, [ndk, event, isBookmarkedByMe, myBookmarkList]);

  const unbookmark = useCallback(() => {
    if (!event || !ndk) {
      return;
    }

    if (!isBookmarkedByMe) {
      return;
    }

    const e = new NDKEvent(ndk);
    e.kind = 10397 as NDKKind;
    e.tags = myBookmarkList?.tags.filter((t) => t[1] !== event.tagAddress()) || [];
    e.publish();
  }, [ndk, event, isBookmarkedByMe, myBookmarkList]);

  return { isBookmarkedByMe, bookmark, unbookmark };
};

const useMyBookmarkList = (enable: boolean) => {
  const { activeUser } = useActiveUser();

  const subId = activeUser && enable ? `my-bookmark-list` : undefined;

  const { createSubscription, events } = useSubscription(subId);

  const myBookmarkList = useMemo(
    () => (events && events.length > 0 ? events[events.length - 1] : undefined),
    [events],
  );

  useEffect(() => {
    activeUser &&
      enable &&
      createSubscription({
        filters: [{ kinds: [10397 as NDKKind], authors: [activeUser.pubkey], limit: 1 }],
        opts: { groupableDelay: 500 },
      });
  }, [createSubscription, enable, activeUser]);

  return { myBookmarkList };
};
