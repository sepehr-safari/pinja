import { NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  BarcodeIcon,
  Edit2Icon,
  EllipsisIcon,
  FileJsonIcon,
  LinkIcon,
  SquareArrowOutUpRight,
  TextIcon,
  TriangleAlertIcon,
  XSquareIcon,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

import { PinParentPreview } from '../pin-parent-preview';

import { usePinHeader } from './hooks';

export const PinHeader = ({ event }: { event: NDKEvent }) => {
  const { copy, navigate, profile, naddr, ref, deletePin, activeUser } = usePinHeader(event);

  return (
    <>
      <div className="pt-2 flex justify-between gap-2" ref={ref}>
        <Avatar
          className="bg-foreground/10 hover:cursor-pointer"
          onClick={() => navigate(`/profile/${new NDKUser({ pubkey: event.pubkey }).npub}`)}
        >
          <AvatarImage src={profile?.image} alt={profile?.name} className="object-cover" />
          <AvatarFallback />
        </Avatar>

        <div className="grow flex flex-col justify-center">
          <p
            className="w-fit font-semibold leading-tight hover:cursor-pointer"
            onClick={() => navigate(`/profile/${new NDKUser({ pubkey: event.pubkey }).npub}`)}
          >
            {profile?.name?.toString()}
          </p>

          <p
            className="w-fit text-xs text-gray-500 leading-tight hover:cursor-pointer"
            onClick={() => navigate(`/profile/${new NDKUser({ pubkey: event.pubkey }).npub}`)}
          >
            {profile?.nip05?.toString().replace('_@', '')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {event.kind === 39700 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <TriangleAlertIcon className="w-4 h-4 text-yellow-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Deprecated event kind 39700 due to NIP-B0</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <p className="text-xs text-gray-500">
            {formatDistanceToNowStrict((event.created_at || 0) * 1000)}
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link" size="icon" className="opacity-40 hover:opacity-100">
                <EllipsisIcon size={18} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8}>
              <DropdownMenuItem onClick={() => navigate(`/pin/${naddr}`)}>
                <SquareArrowOutUpRight className="w-4 h-4 mr-2" />
                Open
              </DropdownMenuItem>

              {/* <DropdownMenuItem
                onClick={() => {
                  // TODO
                }}
              >
                <HeartIcon className="w-4 h-4 mr-2" />
                Reactions
              </DropdownMenuItem> */}

              <DropdownMenuItem onClick={() => copy(`${window.location.origin}/pin/${naddr}`)}>
                <LinkIcon className="w-4 h-4 mr-2" />
                Copy link to this pin
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => copy(event.content)}>
                <TextIcon className="w-4 h-4 mr-2" />
                Copy pinned URL
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => copy(naddr)}>
                <BarcodeIcon className="w-4 h-4 mr-2" />
                Copy event ID
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => copy(JSON.stringify(event.rawEvent()))}>
                <FileJsonIcon className="w-4 h-4 mr-2" />
                Copy raw data
              </DropdownMenuItem>

              {activeUser?.pubkey === event.pubkey && (
                <>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => navigate(`/pin/${naddr}/edit`)}>
                    <Edit2Icon className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => deletePin(event)}
                  >
                    <XSquareIcon className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="pt-2">
        <PinParentPreview event={event} />
      </div>
    </>
  );
};
