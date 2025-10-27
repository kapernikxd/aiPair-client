"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import ModalShell from "./edit/overview/ModalShell";
import { UserDTO } from "@/types";
import { getUserAvatar, getUserFullName, getUsername } from "@/helpers/utils/user";
import { useAuthRoutes } from "@/helpers/hooks/useAuthRoutes";
import { useTranslations } from "@/localization/TranslationProvider";

type UserListModalProps = {
  open: boolean;
  title: string;
  users: UserDTO[];
  isLoading: boolean;
  hasMore: boolean;
  onClose: () => void;
  onLoadMore: () => void;
};

export default function UserListModal({
  open,
  title,
  users,
  isLoading,
  hasMore,
  onClose,
  onLoadMore,
}: UserListModalProps) {
  const { getProfile } = useAuthRoutes();
  const { t } = useTranslations();
  return (
    <ModalShell open={open} onBackdrop={onClose}>
      <div className="flex max-h-[70vh] flex-col">
        <div className="flex items-center justify-between px-6 pb-4 pt-6 sm:px-8">
          <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
          <Button
            type="button"
            onClick={onClose}
            variant="frostedIconCompact"
            aria-label={t("auth.close", "Close")}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 sm:px-8">
          {isLoading && users.length === 0 ? (
            <div className="py-8 text-center text-sm text-white/60">
              {t("common.loading", "Loading...")}
            </div>
          ) : null}

          {!isLoading && users.length === 0 ? (
            <div className="py-8 text-center text-sm text-white/60">
              {t("admin.profile.userList.empty", "No users yet")}
            </div>
          ) : null}

          <ul className="space-y-4">
            {users.map((user) => {
              const avatar = getUserAvatar(user);
              const fullName = getUserFullName(user);
              const username = getUsername(user);

              return (
                <li key={user._id}>
                  <Link
                    href={getProfile(user._id)}
                    onClick={onClose}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 overflow-hidden rounded-2xl border border-white/10">
                        <Image
                          src={avatar}
                          alt={`Аватар пользователя ${fullName}`}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white">{fullName}</p>
                        {username ? <p className="text-sm text-white/50">{username}</p> : null}
                      </div>
                    </div>
                    <svg
                      viewBox="0 0 24 24"
                      className="size-4 shrink-0 text-white/50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                    </svg>
                  </Link>
                </li>
              );
            })}
          </ul>

          {isLoading && users.length > 0 ? (
            <div className="py-4 text-center text-sm text-white/60">
              {t("common.loading", "Loading...")}
            </div>
          ) : null}
        </div>

        {hasMore ? (
          <div className="border-t border-white/10 px-6 py-4 sm:px-8">
            <Button
              type="button"
              onClick={onLoadMore}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading
                ? t("common.loading", "Loading...")
                : t("common.loadMore", "Load more")}
            </Button>
          </div>
        ) : null}
      </div>
    </ModalShell>
  );
}
