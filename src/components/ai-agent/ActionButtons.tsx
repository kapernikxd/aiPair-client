import Link from "next/link";
import { Check, MessageCircle, Share2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";


export default function ActionButtons({
    homeHref,
}: {
    homeHref: string;
}) {
    return (
        <div className="flex items-center gap-3 self-start md:self-center">
            <Link href={homeHref} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/10">
                Discover more
            </Link>
            <Button variant="ghostPill">
                <Share2 className="size-4" /> Share
            </Button>


            {/* Primary CTA row */}
            <div className="hidden md:flex" />
        </div>
    );
}


interface PrimaryCTAProps {
  chatHref: string;
  isFollowing?: boolean;
  isBusy?: boolean;
  disableFollowAction?: boolean;
  onToggleFollow?: () => void;
}

export function PrimaryCTAs({
  chatHref,
  isFollowing,
  isBusy,
  disableFollowAction,
  onToggleFollow,
}: PrimaryCTAProps) {
  const isActionDisabled = disableFollowAction || isBusy || !onToggleFollow;
  const buttonLabel = isBusy
    ? "Processing..."
    : isFollowing
      ? "Subscribed"
      : "Follow";
  const ButtonIcon = isFollowing ? Check : UserPlus;
  const buttonVariant = isFollowing ? "outline" : "primary";

  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <div className="flex flex-1">
        <Button
          variant={buttonVariant}
          className="w-full justify-center"
          disabled={isActionDisabled}
          onClick={onToggleFollow}
          aria-pressed={Boolean(isFollowing)}
        >
          <ButtonIcon className="size-4" />
          {buttonLabel}
        </Button>
      </div>
      <Link
        href={chatHref}
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/5"
      >
        <MessageCircle className="size-4" /> Chat with aiAgent
      </Link>
    </div>
  );
}
