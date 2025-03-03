import { ChevronDownIcon, PlusIcon, XIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

import { cn } from '@/shared/utils';

import { useNewPinWidget } from './hooks';

export const NewPinWidget = () => {
  const {
    content,
    post,
    setContent,
    profile,
    hashtags,
    setHashtags,
    newHashtag,
    setNewHashtag,
    showOptions,
    setShowOptions,
    description,
    setDescription,
  } = useNewPinWidget();

  return (
    <>
      <div className="px-2">
        <div className="p-2 flex flex-col gap-2 border rounded-sm bg-primary/10 shadow-md transition-colors duration-500 ease-out hover:border-primary/30">
          <div className="flex gap-2">
            <Avatar>
              <AvatarImage src={profile?.image} alt={profile?.name} className="object-cover" />
              <AvatarFallback className="bg-muted" />
            </Avatar>

            <Input
              className="bg-background"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="https://"
            />
          </div>

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

            <Button className="px-8 ml-auto" onClick={post}>
              Pin it
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
