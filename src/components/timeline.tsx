
'use client';

import { TimelineEvent } from '@/lib/types';
import {
  PartyPopper,
  ArrowRightLeft,
  Image as ImageIcon,
  Coins,
  Zap,
  Star,
  Wind,
  LucideIcon,
  Landmark,
} from 'lucide-react';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TimelineProps = {
  events: TimelineEvent[];
};

const eventTypeConfig: {
  [key in TimelineEvent['type']]: {
    icon: LucideIcon;
    color: string;
  };
} = {
  Creation: { icon: PartyPopper, color: 'text-green-500' },
  Transaction: { icon: Landmark, color: 'text-blue-500' },
  NFT: { icon: ImageIcon, color: 'text-purple-500' },
  Token: { icon: Coins, color: 'text-yellow-500' },
  Activity: { icon: Zap, color: 'text-orange-500' },
  Milestone: { icon: Star, color: 'text-pink-500' },
};

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative w-full">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
      <div className="space-y-8">
        {events.map((event, index) => {
          const config = eventTypeConfig[event.type];
          const Icon =
            event.type === 'Activity' &&
            event.title.toLowerCase().includes('dormant' || 'quiet')
              ? Wind
              : config.icon;

          const position = index % 2 === 0 ? 'left' : 'right';

          return (
            <div key={index} className="relative flex items-center">
              <div className="absolute left-5 -translate-x-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-card border-2 border-primary/50">
                <Icon className={`${config.color} h-5 w-5`} />
              </div>

              <div className="flex-1 pl-16">
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <div className="group space-y-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <h4 className="font-headline text-lg font-semibold group-hover:text-primary">
                          {event.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-xs text-center"
                    align="center"
                  >
                    <p className="font-semibold">{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    {event.value && <p>Value: {event.value}</p>}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
