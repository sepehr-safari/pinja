import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk, useRealtimeProfile } from 'nostr-hooks';
import { useCallback, useState } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';

export const useNewPinWidget = () => {
  const [url, setUrl] = useState<string>('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState<string>('');
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');

  const { activeUser } = useActiveUser();
  const { profile } = useRealtimeProfile(activeUser?.pubkey);

  const { ndk } = useNdk();

  const { toast } = useToast();

  const post = useCallback(() => {
    if (!ndk || !ndk.signer) {
      return;
    }

    if (url.length === 0 || !url.startsWith('https')) {
      toast({
        title: 'Invalid URL',
        description: 'URL must start with https',
        variant: 'destructive',
      });
      return;
    }

    const e = new NDKEvent(ndk);
    e.kind = 39701;
    e.tags.push(['d', url.replace('https://', '')]);
    e.content = description;
    hashtags.forEach((t) => {
      e.tags.push(['t', t]);
    });

    e.publish()
      .then((relaySet) => {
        if (relaySet.size === 0) {
          toast({
            title: 'Error',
            description: 'Failed to pin',
            variant: 'destructive',
          });
        } else {
          setUrl('');
          setHashtags([]);
        }
      })
      .catch((_) => {
        toast({
          title: 'Error',
          description: 'Failed to pin',
          variant: 'destructive',
        });
      });
  }, [ndk, url, toast, setUrl, hashtags, setHashtags, description]);

  return {
    url,
    setUrl,
    post,
    profile,
    hashtags,
    setHashtags,
    newHashtag,
    setNewHashtag,
    showOptions,
    setShowOptions,
    description,
    setDescription,
  };
};
