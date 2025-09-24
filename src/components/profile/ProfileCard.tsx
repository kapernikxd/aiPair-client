"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { MyProfileDTO } from "@/helpers/types";
import { getUserAvatar, getUserFullName } from "@/helpers/utils/user";
import { getMonthYear, getTimeAgo } from "@/helpers/utils/date";
import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import UserListModal from "./UserListModal";

const PAGE_SIZE = 12;

type ActiveModal = "followers" | "following" | null;

export default function ProfileCard({ profile, genderLabel }: { profile: MyProfileDTO; genderLabel: string }) {
    const profileAvatar = getUserAvatar(profile);
    const userFullName = getUserFullName(profile);
    const followerCount = profile?.followers ?? 0;
    const followingCount = profile?.following ?? 0;

    const { profileStore } = useRootStore();
    const followers = useStoreData(profileStore, (store) => store.followers);
    const following = useStoreData(profileStore, (store) => store.following);
    const followersHasMore = useStoreData(profileStore, (store) => store.followersHasMore);
    const followingHasMore = useStoreData(profileStore, (store) => store.followingHasMore);
    const isLoadingFollowers = useStoreData(profileStore, (store) => store.isLoadingFollowers);
    const isLoadingFollowing = useStoreData(profileStore, (store) => store.isLoadingFollowing);

    const [activeModal, setActiveModal] = useState<ActiveModal>(null);

    useEffect(() => {
        if (!activeModal) return;

        const params = { page: 1, limit: PAGE_SIZE };

        if (activeModal === "followers") {
            profileStore.resetFollowers();
            void profileStore.fetchMyFollowers(params);
        }

        if (activeModal === "following") {
            profileStore.resetFollowing();
            void profileStore.fetchMyFollowing(params);
        }
    }, [activeModal, profileStore]);

    const activeUsers = useMemo(() => {
        if (activeModal === "followers") return followers;
        if (activeModal === "following") return following;
        return [];
    }, [activeModal, followers, following]);

    const modalState = useMemo(() => {
        if (activeModal === "followers") {
            return { hasMore: followersHasMore, isLoading: isLoadingFollowers };
        }

        if (activeModal === "following") {
            return { hasMore: followingHasMore, isLoading: isLoadingFollowing };
        }

        return { hasMore: false, isLoading: false };
    }, [activeModal, followersHasMore, followingHasMore, isLoadingFollowers, isLoadingFollowing]);

    const handleCloseModal = () => {
        if (activeModal === "followers") {
            profileStore.resetFollowers();
        }

        if (activeModal === "following") {
            profileStore.resetFollowing();
        }

        setActiveModal(null);
    };

    const handleLoadMore = () => {
        if (!activeModal) return;

        if (activeModal === "followers") {
            const nextPage = Math.floor(followers.length / PAGE_SIZE) + 1;
            void profileStore.fetchMyFollowers({ page: nextPage, limit: PAGE_SIZE });
            return;
        }

        const nextPage = Math.floor(following.length / PAGE_SIZE) + 1;
        void profileStore.fetchMyFollowing({ page: nextPage, limit: PAGE_SIZE });
    };

    return (
        <>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 items-start gap-5">
                        <div className="relative size-24 shrink-0 overflow-hidden rounded-3xl border border-white/15">
                            <Image
                                src={profileAvatar}
                                alt={`${userFullName} portrait`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 96px, 150px"
                            />
                        </div>
                        <div className="space-y-3">
                            <div>
                                <h1 className="text-4xl font-semibold tracking-tight">{userFullName}</h1>
                                <p className="mt-2 text-sm leading-6 text-white/70">{profile?.userBio}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-white/60">
                                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">{genderLabel}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wide text-white/40">Connections</p>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setActiveModal("followers")}
                                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
                            >
                                <p className="text-2xl font-semibold text-white">{followerCount}</p>
                                <p className="text-xs uppercase tracking-wide text-white/50">Followers</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveModal("following")}
                                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
                            >
                                <p className="text-2xl font-semibold text-white">{followingCount}</p>
                                <p className="text-xs uppercase tracking-wide text-white/50">Following</p>
                            </button>
                        </div>
                    </div>
                    <div className="grid w-full max-w-xs gap-4 rounded-2xl border border-white/10 bg-neutral-900/80 p-5 text-sm text-white/70">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-white/40">Membership</p>
                            <p className="mt-1 font-medium text-white">{profile?.role}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-white/40">Joined</p>
                            <p className="mt-1">{getMonthYear(profile?.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-white/40">Last updated</p>
                            <p className="mt-1">{getTimeAgo(profile?.updatedAt)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <UserListModal
                open={activeModal !== null}
                title={activeModal === "followers" ? "Followers" : "Following"}
                users={activeUsers}
                isLoading={Boolean(activeModal) && modalState.isLoading}
                hasMore={Boolean(activeModal) && modalState.hasMore}
                onClose={handleCloseModal}
                onLoadMore={handleLoadMore}
            />
        </>
    );
}