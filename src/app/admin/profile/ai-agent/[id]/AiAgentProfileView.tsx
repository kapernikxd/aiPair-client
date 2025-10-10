import { ArrowLeft, Share2 } from "lucide-react";
import HeaderCard from "@/components/ai-agent/HeaderCard";
import StatChips from "@/components/ai-agent/StatChips";
import { PrimaryCTAs } from "@/components/ai-agent/ActionButtons";
import Introduction from "@/components/ai-agent/Introduction";
import SignatureMoves from "@/components/ai-agent/SignatureMoves";
import HighlightsSidebar from "@/components/ai-agent/HighlightsSidebar";
import BotGallery from "@/components/ai-agent/BotGallery";
import { Button } from "@/components/ui/Button";
import EditAiAgentDialog from "@/components/ai-agent/edit/EditAiAgentDialog";
import MoreActionsMenu from "@/components/MoreActionsMenu";
import SessionVibe from "@/components/ai-agent/SessionVibe";
import type { ActiveTab } from "@/helpers/hooks/aiAgent/useAiAgentProfile";
import { Highlight } from "@/helpers/types/ai-agent";
import { AiBotDetails, AiBotDTO } from "@/helpers/types";

type Props = {
  // data
  aiBot: AiBotDTO | null;
  isLoading: boolean;
  botDetails: AiBotDetails | null;
  botPhotos: string[];
  botDetailsLoading: boolean;
  highlights: Highlight[];
  // ui state
  activeTab: ActiveTab;
  setActiveTab: (t: ActiveTab) => void;
  isEditOpen: boolean;
  setIsEditOpen: (v: boolean) => void;
  closeEditDialog: () => void;
  // flags
  canEdit: boolean;
  isCreator: boolean;
  isFollowing: boolean;
  disableFollowAction: boolean;
  isFollowUpdating: boolean;
  isChatLoading: boolean;
  // misc
  chatHref: string;
  aiBotProfileId?: string;
  isMdUp: boolean;
  t: (key: string, fallback: string) => string;
  // handlers
  onBack: () => void;
  handleShare: () => void;
  handleToggleFollow: () => void;
  handleStartChat: () => void;
  handleAiAgentDeleted: () => void;
};

export function AiAgentProfileView(props: Props) {
  const {
    aiBot, isLoading, botDetails, botPhotos, botDetailsLoading,
    activeTab, setActiveTab,
    isEditOpen, setIsEditOpen, closeEditDialog,
    canEdit, isCreator, isFollowing, disableFollowAction, isFollowUpdating, isChatLoading,
    chatHref, aiBotProfileId,
    isMdUp, t,
    onBack, handleShare, handleToggleFollow, handleStartChat, handleAiAgentDeleted, highlights,
  } = props;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 pb-32 md:pb-20 pt-4 md:pt-14 text-white">
      {canEdit && aiBot && (
        <EditAiAgentDialog open={isEditOpen} aiAgent={aiBot} onClose={closeEditDialog} />
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {isMdUp && (
            <Button
              type="button"
              onClick={onBack}
              variant="frostedIcon"
              aria-label={t("admin.profile.aiAgent.backAria", "Go back")}
            >
              <ArrowLeft className="size-5" />
            </Button>
          )}
          <Button
            type="button"
            onClick={handleShare}
            variant="frostedIcon"
            aria-label={t("admin.profile.aiAgent.shareAria", "Share agent")}
          >
            <Share2 className="size-5" />
          </Button>
          <MoreActionsMenu
            mode="aiAgent"
            reportTargetId={aiBotProfileId}
            aiAgentId={aiBotProfileId}
            canDeleteAiAgent={isCreator}
            onAiAgentDeleted={handleAiAgentDeleted}
          />
        </div>
        {canEdit && (
          <div className="flex items-center gap-3">
            <Button type="button" onClick={() => setIsEditOpen(true)} variant="solidWhitePill">
              {t("admin.profile.aiAgent.editButton", "Edit AI Agent")}
            </Button>
          </div>
        )}
      </div>

      {!aiBot ? (
        <div className="rounded-3xl border border-white/10 bg-neutral-900/70 p-8 text-center text-sm text-white/70">
          {isLoading
            ? t("admin.profile.aiAgent.loading", "Loading agent profile…")
            : t("admin.profile.aiAgent.unavailable", "This agent is unavailable or no longer exists.")}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5/50 p-1 md:p-8 backdrop-blur">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <HeaderCard user={aiBot} />
            </div>
            {botDetails?.categories && <StatChips items={botDetails.categories} />}
            <PrimaryCTAs
              chatHref={chatHref}
              isFollowing={isFollowing}
              isBusy={isFollowUpdating}
              disableFollowAction={disableFollowAction}
              onToggleFollow={handleToggleFollow}
              onStartChat={handleStartChat}
              isChatLoading={isChatLoading}
            />
          </div>

          <section className="grid gap-6 md:grid-cols-[1.3fr,1fr]">
            <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-1 md:p-8">
              <div className="inline-flex rounded-full bg-white/5 p-1 text-sm font-medium text-white/70 p-2 md:p-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("info")}
                  className={`rounded-full px-4 py-2 transition ${
                    activeTab === "info" ? "bg-white text-neutral-900 shadow" : "hover:text-white"
                  }`}
                >
                  {t("admin.profile.aiAgent.tabs.info", "Information")}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("gallery")}
                  className={`rounded-full px-4 py-2 transition ${
                    activeTab === "gallery" ? "bg-white text-neutral-900 shadow" : "hover:text-white"
                  }`}
                >
                  {t("admin.profile.aiAgent.tabs.gallery", "Gallery")}
                </button>
              </div>

              <div className="mt-6 space-y-6">
                {activeTab === "info" ? (
                  <>
                    {botDetails?.aiPrompt && <Introduction text={botDetails.aiPrompt} />}
                    {botDetails && <SessionVibe description={botDetails.intro} />}
                    {botDetails?.usefulness && <SignatureMoves items={botDetails.usefulness} />}
                    <HighlightsSidebar highlights={highlights} />
                  </>
                ) : (
                  <BotGallery photos={botPhotos} isLoading={botDetailsLoading} />)
                }
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}