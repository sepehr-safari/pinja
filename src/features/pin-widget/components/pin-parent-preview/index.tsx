import { NDKEvent, NDKUserProfile } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ellipsis } from '@/shared/utils';

export const PinParentPreview = ({ event }: { event: NDKEvent }) => {
  const navigate = useNavigate();

  const [replyEvent, setReplyEvent] = useState<NDKEvent | null | undefined>(undefined);

  const [replyAuthorProfile, setReplyAuthorProfile] = useState<NDKUserProfile | null | undefined>(
    undefined,
  );

  const { ndk } = useNdk();

  useEffect(() => {
    if (!ndk) {
      return;
    }

    const aTags = event.getMatchingTags('a');
    if (aTags.length === 0) {
      return;
    }

    const aTag = aTags[0];
    if (aTag.length === 0) {
      return;
    }

    const aTagAddress = aTag[1];

    ndk.fetchEvent(aTagAddress).then((replyEvent) => {
      setReplyEvent(replyEvent);
    });
  }, [ndk, event, setReplyEvent]);

  useEffect(() => {
    !replyAuthorProfile &&
      replyEvent?.author.fetchProfile().then((profile) => {
        setReplyAuthorProfile(profile);
      });
  }, [replyEvent, replyAuthorProfile, setReplyAuthorProfile]);

  if (!replyEvent) {
    return null;
  }

  return (
    <>
      <div className="pb-2">
        <p className="text-xs">
          <span>replying to </span>
          <button
            className="text-xs text-blue-600 hover:underline"
            onClick={() => navigate(`/profile/${replyEvent?.author.npub || 'unknown'}`)}
          >
            {replyAuthorProfile?.name || ellipsis(replyEvent?.author.npub || 'unknown', 10)}
          </button>
        </p>
      </div>
    </>
  );
};
