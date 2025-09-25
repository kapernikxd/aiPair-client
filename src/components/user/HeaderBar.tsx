import { ArrowLeft, Check, MoreHorizontal, Share2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface HeaderBarProps {
  isFollowing?: boolean;
  isBusy?: boolean;
  disableFollowAction?: boolean;
  onToggleFollow?: () => void;
}

export default function HeaderBar({
  isFollowing,
  isBusy,
  disableFollowAction,
  onToggleFollow,
}: HeaderBarProps) {
  const isActionDisabled = disableFollowAction || isBusy || !onToggleFollow;
  const buttonLabel = isBusy
    ? "Processing..."
    : isFollowing
      ? "Subscribed"
      : "Subscribe";
  const ButtonIcon = isFollowing ? Check : Sparkles;
  const buttonVariant = isFollowing ? "frostedPill" : "subscribe";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Button variant="frostedIcon">
          <ArrowLeft className="size-5" />
        </Button>
        <Button variant="frostedIcon">
          <Share2 className="size-5" />
        </Button>
        <Button variant="frostedIcon">
          <MoreHorizontal className="size-5" />
        </Button>
      </div>
      <Button
        variant={buttonVariant}
        onClick={onToggleFollow}
        disabled={isActionDisabled}
        aria-pressed={Boolean(isFollowing)}
      >
        <ButtonIcon className="size-4" />
        {buttonLabel}
      </Button>
    </div>
  );
}
