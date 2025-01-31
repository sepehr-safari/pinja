import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

import { useNewPinWidget } from './hooks';

export const NewPinWidget = () => {
  const { content, post, setContent, profile } = useNewPinWidget();

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

          <div className="w-full flex gap-2 justify-end">
            <Button className="px-8" size="sm" onClick={post}>
              Pin it
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
