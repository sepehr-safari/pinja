import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk, useRealtimeProfile } from 'nostr-hooks';
import { useCallback, useState } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';

export const useNewPinWidget = () => {
  const [content, setContent] = useState<string>('');

  const { activeUser } = useActiveUser();
  const { profile } = useRealtimeProfile(activeUser?.pubkey);

  const { ndk } = useNdk();

  const { toast } = useToast();

  const post = useCallback(() => {
    if (!ndk || !ndk.signer) {
      return;
    }

    if (content.length === 0 || (!content.startsWith('http') && !content.startsWith('www'))) {
      toast({
        title: 'Invalid URL',
        description: 'URL must start with http or www',
        variant: 'destructive',
      });
      return;
    }

    const e = new NDKEvent(ndk);
    e.kind = 39700;
    e.content = content;

    e.publish()
      .then((relaySet) => {
        if (relaySet.size === 0) {
          toast({
            title: 'Error',
            description: 'Failed to pin',
            variant: 'destructive',
          });
        } else {
          setContent('');
        }
      })
      .catch((_) => {
        toast({
          title: 'Error',
          description: 'Failed to pin',
          variant: 'destructive',
        });
      });
  }, [ndk, content, toast, setContent]);

  return { content, setContent, post, profile };
};
