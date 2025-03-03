import { NDKEvent } from '@nostr-dev-kit/ndk';
import { ArrowRightIcon, ChevronDownIcon, PlusIcon, XIcon } from 'lucide-react';
import { useNdk } from 'nostr-hooks';
import { naddrEncode } from 'nostr-tools/nip19';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';

import { cn } from '@/shared/utils';

const parsePinEvent = (pinEvent: NDKEvent) => {
  const url =
    pinEvent.content.startsWith('http://') || pinEvent.content.startsWith('https://')
      ? pinEvent.content
      : `https://${pinEvent.content}`;

  const descriptionTags = pinEvent.getMatchingTags('description');
  const descriptionTag = descriptionTags.length > 0 ? descriptionTags[0] : null;
  const description = descriptionTag && descriptionTag.length > 0 ? descriptionTag[1] : '';
  const tTags = pinEvent.getMatchingTags('t');
  const hashtags = tTags
    .map((tTag) => (tTag.length > 1 ? tTag[1] : null))
    .filter((t) => t !== null);

  return {
    url,
    description,
    hashtags,
  };
};

export const PinContent = ({ event, editMode }: { event: NDKEvent; editMode?: boolean }) => {
  const parsedPinEvent = useMemo(() => parsePinEvent(event), [event]);

  const [content, setContent] = useState<string>(parsedPinEvent.url);
  const [description, setDescription] = useState<string>(parsedPinEvent.description);
  const [hashtags, setHashtags] = useState<string[]>(parsedPinEvent.hashtags);
  const [newHashtag, setNewHashtag] = useState<string>('');
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const { ndk } = useNdk();

  const { toast } = useToast();

  const navigate = useNavigate();

  const update = useCallback(
    (event: NDKEvent) => {
      if (!event || !ndk || !ndk.signer) {
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
      e.kind = event.kind;
      e.dTag = event.dTag;
      e.content = content;
      e.tags.push(['description', description]);
      hashtags.forEach((t) => {
        e.tags.push(['t', t]);
      });

      e.publish()
        .then((relaySet) => {
          if (relaySet.size === 0) {
            toast({
              title: 'Error',
              description: 'Failed to update pin',
              variant: 'destructive',
            });
          } else {
            const naddr = naddrEncode({
              identifier: event.tagAddress(),
              kind: event.kind || 39700,
              pubkey: event.pubkey,
              relays: event.onRelays.map((relay) => relay.url),
            });

            navigate(`/pin/${naddr}`);
          }
        })
        .catch((_) => {
          toast({
            title: 'Error',
            description: 'Failed to update pin',
            variant: 'destructive',
          });
        });
    },
    [ndk, content, toast, setContent, hashtags, navigate, description],
  );

  return (
    <>
      {editMode ? (
        <>
          <div className="flex flex-col gap-2 pb-2">
            <Input
              className="bg-background"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="https://"
            />

            {showOptions && (
              <>
                <Input
                  className="bg-background"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                />

                <div className="flex items-center gap-2 flex-wrap p-2 border rounded-md bg-background w-full">
                  {hashtags.map((t) => (
                    <div
                      key={t}
                      className="p-2 border rounded-md text-xs flex items-center gap-2 bg-secondary text-secondary-foreground"
                    >
                      <div
                        className="flex items-center justify-center cursor-pointer"
                        onClick={() => setHashtags((prev) => prev.filter((h) => h !== t))}
                      >
                        <XIcon className="w-4 h-4" />
                      </div>

                      <div className="pr-2">#{t}</div>
                    </div>
                  ))}

                  <div className="flex gap-2 items-center">
                    <Input
                      className="bg-background"
                      value={newHashtag}
                      onChange={(e) => setNewHashtag(e.target.value.trim())}
                      placeholder="Add Hashtag (e.g. music)"
                      onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                          newHashtag &&
                            setHashtags((prev) =>
                              prev.includes(newHashtag) ? prev : [...prev, newHashtag],
                            );
                          setNewHashtag('');
                        }
                      }}
                    />

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        newHashtag &&
                          setHashtags((prev) =>
                            prev.includes(newHashtag) ? prev : [...prev, newHashtag],
                          );
                        setNewHashtag('');
                      }}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}

            <div className="w-full flex gap-2">
              <Button variant="outline" onClick={() => setShowOptions((prev) => !prev)}>
                {showOptions ? 'Less Options' : 'More Options'}
                <ChevronDownIcon
                  className={cn(
                    'ml-1 w-4 h-4 transition-transform duration-300',
                    showOptions && 'transform -rotate-180',
                  )}
                />
              </Button>

              <Button className="px-8 ml-auto" onClick={() => update(event)}>
                Update
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <a
            href={parsedPinEvent?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="[overflow-wrap:anywhere] text-primary flex items-center group hover:underline"
          >
            {parsedPinEvent?.url}

            <ArrowRightIcon className="ml-1 w-4 h-4 opacity-0 -translate-x-1 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-80" />
          </a>

          {parsedPinEvent?.description !== '' && (
            <div className="text-sm [overflow-wrap:anywhere]">{parsedPinEvent?.description}</div>
          )}

          <div className="flex items-center flex-wrap gap-2">
            {parsedPinEvent?.hashtags.map((t) => (
              <div
                key={t}
                className="p-2 border rounded-md text-xs flex items-center gap-2 bg-secondary text-secondary-foreground hover:underline hover:cursor-pointer"
              >
                #{t}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
