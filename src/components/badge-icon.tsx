
import {
  Footprints,
  Award,
  Repeat,
  Zap,
  Moon,
  Gem,
  Crown,
  Trophy,
  Briefcase,
  Cake,
  Clock,
  Shield,
  Image as ImageIcon,
  Paintbrush2,
  Compass,
  Gift,
  LucideProps,
  LucideIcon,
} from 'lucide-react';

// Create a mapping from string names to actual Lucide components
const iconMap: { [key: string]: LucideIcon } = {
  Footprints,
  Award,
  Repeat,
  Zap,
  Moon,
  Gem,
  Crown,
  Trophy,
  Briefcase,
  Cake,
  Clock,
  Shield,
  Image: ImageIcon,
  Paintbrush2,
  Compass,
  Gift,
};

type BadgeIconProps = LucideProps & {
  iconName: string;
};

export function BadgeIcon({ iconName, ...props }: BadgeIconProps) {
  const IconComponent = iconMap[iconName];

  if (iconName === '💎') {
    return <span {...props} style={{...props.style, fontSize: props.size || 24, lineHeight: 1 }}>💎</span>;
  }
  
  if (IconComponent) {
    return <IconComponent {...props} />;
  }

  // Fallback icon if no match is found
  return <Award {...props} />;
}
