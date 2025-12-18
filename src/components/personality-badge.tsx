import { Badge } from "@/components/ui/badge";

type PersonalityBadgeProps = {
  personality: string;
};

export function PersonalityBadge({ personality }: PersonalityBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="mx-auto scale-100 transform transition-all duration-500 animate-in fade-in zoom-in-95"
    >
      <div className="flex items-center gap-3 px-4 py-2">
        <span className="text-4xl">{personality.split(" ")[0]}</span>
        <span className="text-xl font-medium font-headline">
          {personality.substring(personality.indexOf(" ") + 1)}
        </span>
      </div>
    </Badge>
  );
}
