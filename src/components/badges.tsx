
'use client';

import { Badge as BadgeType } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { BadgeIcon } from './badge-icon';
import { cn } from '@/lib/utils';


const rarityStyles = {
    Common: {
        container: 'border-muted-foreground/20 bg-card hover:border-muted-foreground/50',
        icon: 'text-muted-foreground/80 group-hover:text-muted-foreground',
    },
    Rare: {
        container: 'border-blue-500/20 bg-card hover:border-blue-500/70 shadow-inner',
        icon: 'text-blue-500/80 group-hover:text-blue-500',
        glow: 'shadow-[0_0_15px_-3px] shadow-blue-500/50',
    },
    Epic: {
        container: 'border-purple-500/20 bg-card hover:border-purple-500/70',
        icon: 'text-purple-500/80 group-hover:text-purple-500',
        glow: 'shadow-[0_0_18px_-3px] shadow-purple-500/50',
    },
    Legendary: {
        container: 'border-amber-500/30 bg-card hover:border-amber-500/70',
        icon: 'text-amber-500/80 group-hover:text-amber-500',
        glow: 'shadow-[0_0_24px_-3px] shadow-amber-500/60',
    },
}

type BadgesProps = {
  badges: BadgeType[];
};

export function Badges({ badges }: BadgesProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4 justify-center">
      {badges.map((badge, index) => {
        const styles = rarityStyles[badge.rarity] || rarityStyles.Common;
        
        return (
            <Tooltip key={badge.id} delayDuration={100}>
            <TooltipTrigger asChild>
                <div
                className="group flex flex-col items-center gap-2 transform transition-transform hover:scale-110 cursor-pointer animate-in fade-in-0 zoom-in-90 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
                >
                <div className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full border-2 p-3 transition-all duration-300",
                    styles.container,
                    styles.glow
                )}>
                    <BadgeIcon iconName={badge.icon} className={cn("h-8 w-8", styles.icon)} />
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
                <p className="text-xs text-amber-500 mt-1">{badge.rarity}</p>
            </TooltipContent>
            </Tooltip>
        )
      })}
    </div>
  );
}
