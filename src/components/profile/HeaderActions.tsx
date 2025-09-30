"use client";

import { ArrowLeft, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/Button';
import { useBreakpoint } from "@/helpers/hooks/useBreakpoint";
import MoreActionsMenu from "@/components/MoreActionsMenu";
import { useTranslations } from "@/localization/TranslationProvider";


export default function HeaderActions({ onEdit }: { onEdit: () => void }) {
    const router = useRouter();
    const { isMdUp } = useBreakpoint(); // md (≥768px) и выше
    const { t } = useTranslations();

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
                <MoreActionsMenu mode="self" />
            </div>
            <div className="flex items-center gap-3">
                <Button onClick={onEdit} variant="solidWhitePill">
                    {t("admin.profile.my.editButton", "Edit Profile")}
                </Button>
            </div>
        </div>
    );
}