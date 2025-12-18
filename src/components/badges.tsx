
'use client';

import { Badge as BadgeType } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { BadgeIcon } from './badge-icon';

type BadgesProps = {
  badges: BadgeType[];
};

export function Badges({ badges }: BadgesProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4 justify-center">
      {badges.map((badge, index) => (
        <Tooltip key={badge.id} delayDuration={100}>
          <TooltipTrigger asChild>
            <div
              className="group flex flex-col items-center gap-2 transform transition-transform hover:scale-110 cursor-pointer animate-in fade-in-0 zoom-in-90 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/20 bg-card p-3 group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                <BadgeIcon iconName={badge.icon} className="h-8 w-8 text-primary/80 group-hover:text-primary" />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="max-w-xs text-center bg-background border-primary/50"
            align="center"
          >
            <p className="font-bold font-headline text-primary">{badge.name}</p>
            <p className="text-sm text-muted-foreground">{badge.description}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
