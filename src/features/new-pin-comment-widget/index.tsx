import { NDKEvent } from '@nostr-dev-kit/ndk';
import { CornerDownRightIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';

import { useNewPinCommentWidget } from './hooks';

export const NewPinCommentWidget = ({ pinEvent }: { pinEvent: NDKEvent }) => {
  const { content, post, setContent, profile } = useNewPinCommentWidget(pinEvent);

  return (
    <>
      <div className="px-2">
        <div className="-mx-2 pl-4 p-2 flex flex-col gap-2 border rounded-sm bg-primary/10 shadow-md transition-colors duration-500 ease-out hover:border-primary/30">
          <div className="flex gap-2">
            <div className="pt-2 opacity-50">
              <CornerDownRightIcon size={18} />
            </div>

            <Avatar>
              <AvatarImage src={profile?.image} alt={profile?.name} className="object-cover" />
              <AvatarFallback className="bg-muted" />
            </Avatar>

            <Textarea
              className="bg-background"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="w-full flex gap-2 justify-end">
            <Button className="px-8" size="sm" onClick={post}>
              Post
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
