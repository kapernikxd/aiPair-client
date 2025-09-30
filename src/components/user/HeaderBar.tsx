"use client";

import { ArrowLeft, Check, Share2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { useBreakpoint } from "@/helpers/hooks/useBreakpoint";
import MoreActionsMenu from "@/components/MoreActionsMenu";
import { useTranslations } from "@/localization/TranslationProvider";

interface HeaderBarProps {
  isFollowing?: boolean;
  isBusy?: boolean;
  disableFollowAction?: boolean;
  onToggleFollow?: () => void;
  isCurrentUser?: boolean;
  profileId?: string;
}

export default function HeaderBar({
  isFollowing,
  isBusy,
  disableFollowAction,
  onToggleFollow,
  isCurrentUser = false,
  profileId,
}: HeaderBarProps) {
  const { t } = useTranslations();
  const isActionDisabled = disableFollowAction || isBusy || !onToggleFollow;
  const buttonLabel = isBusy
    ? t("admin.profile.user.header.processing", "Processing...")
    : isFollowing
      ? t("admin.profile.user.header.subscribed", "Subscribed")
      : t("admin.profile.user.header.subscribe", "Subscribe");
  const ButtonIcon = isFollowing ? Check : Sparkles;
  const buttonVariant = isFollowing ? "frostedPill" : "subscribe";
  const router = useRouter();
  const { isMdUp } = useBreakpoint(); // md (≥768px) и выше

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {isMdUp && (
          <Button
            type="button"
            onClick={() => router.back()}
            variant="frostedIcon"
            aria-label={t("admin.profile.common.backAria", "Go back")}
          >
            <ArrowLeft className="size-5" />
          </Button>
        )}
        <Button
          type="button"
          variant="frostedIcon"
          aria-label={t("admin.profile.common.shareAria", "Share")}
        >
          <Share2 className="size-5" />
        </Button>
        <MoreActionsMenu
          mode={isCurrentUser ? "self" : "user"}
          reportTargetId={isCurrentUser ? undefined : profileId}
        />
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
