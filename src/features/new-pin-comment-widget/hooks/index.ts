import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk, useRealtimeProfile } from 'nostr-hooks';
import { useCallback, useState } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';

export const useNewPinCommentWidget = (pinEvent: NDKEvent) => {
  const [content, setContent] = useState<string>('');

  const { activeUser } = useActiveUser();
  const { profile } = useRealtimeProfile(activeUser?.pubkey);

  const { ndk } = useNdk();

  const { toast } = useToast();

  const post = useCallback(() => {
    if (!ndk || !ndk.signer) {
      return;
    }

    const e = new NDKEvent(ndk);
    e.kind = 1111;
    e.content = content;

    e.tags.push(['a', pinEvent.tagAddress()]);
    e.tags.push(['k', '39700']);
    e.tags.push(['p', pinEvent.pubkey]);

    e.publish()
      .then((relaySet) => {
        if (relaySet.size === 0) {
          toast({
            title: 'Error',
            description: 'Failed to post comment',
            variant: 'destructive',
          });
        } else {
          setContent('');
        }
      })
      .catch((_) => {
        toast({
          title: 'Error',
          description: 'Failed to post comment',
          variant: 'destructive',
        });
      });
  }, [ndk, content, pinEvent, toast, setContent]);

  return { content, setContent, post, profile };
};
