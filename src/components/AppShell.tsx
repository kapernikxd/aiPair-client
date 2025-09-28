'use client';

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import {
    Menu,
    ChevronLeft,
    Home,
    Search,
    MessageSquare,
    PlusCircle,
    MessagesSquare,
} from 'lucide-react';
import { useAuthRoutes } from '@/helpers/hooks/useAuthRoutes';
import ProfileSection from './ProfileSection';
import AuthPopupContainer from './AuthPopupContainer';
import { useRootStore, useStoreData } from '@/stores/StoreProvider';
import { getUserAvatar, getUserFullName } from '@/helpers/utils/user';
import { textRefactor } from '@/helpers/utils/common';
import { Logo } from './ui/Logo';

type AppShellProps = {
    children: React.ReactNode;
    sidebarWidth?: number; // ширина раскрытого меню (px)
    sidebarCollapsed?: number; // ширина свернутого меню (px)
};

export default function AppShell({
    children,
    sidebarWidth = 280,
    sidebarCollapsed = 80,
}: AppShellProps) {
    const router = useRouter();
    const { routes } = useAuthRoutes();

    const { uiStore, profileStore, authStore, chatStore } = useRootStore();
    const open = useStoreData(uiStore, (store) => store.isSidebarOpen);
    const mobileOpen = useStoreData(uiStore, (store) => store.isMobileSidebarOpen);

    const profile = useStoreData(profileStore, (store) => store.profile);
    const authUser = useStoreData(authStore, (store) => store.user);
    const isAuthenticated = useStoreData(authStore, (store) => store.isAuthenticated);
    const hasAttemptedAutoLogin = useStoreData(
        authStore,
        (store) => store.hasAttemptedAutoLogin,
    );
    const avatarInitial = (authUser?.name ?? getUserFullName(profile) ?? 'U')
        .charAt(0)
        .toUpperCase();

    const chats = useStoreData(chatStore, (store) => store.chats);
    const isLoadingChats = useStoreData(chatStore, (store) => store.isLoadingChats);
    const currentUserId = useStoreData(authStore, (store) => store.user?.id ?? '');

    useEffect(() => {
        uiStore.hydrateSidebarFromStorage();
    }, [uiStore]);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }
        if (!chatStore.chats.length && !chatStore.isLoadingChats) {
            void chatStore.fetchChats({ page: 1 });
        }
    }, [chatStore, isAuthenticated]);

    const w = useMemo(
        () => (open ? sidebarWidth : sidebarCollapsed),
        [open, sidebarWidth, sidebarCollapsed],
    );

    const adminChatRoute = routes.adminChat;

    const recentChatLinks = useMemo(() => {
        type ChatParticipant = {
            _id: string;
            name: string;
            lastname: string;
            avatarFile?: string;
        };

        const sorted = [...chats]
            .sort((a, b) => {
                const dateA = a.latestMessage?.createdAt
                    ? new Date(a.latestMessage.createdAt).getTime()
                    : 0;
                const dateB = b.latestMessage?.createdAt
                    ? new Date(b.latestMessage.createdAt).getTime()
                    : 0;
                return dateB - dateA;
            })
            .slice(0, 10);

        return sorted.map((chat) => {
            const rawParticipants = (chat.users as unknown as Array<ChatParticipant | string>) ?? [];
            const participants = rawParticipants.filter(
                (user): user is ChatParticipant =>
                    typeof user === 'object' &&
                    user !== null &&
                    '_id' in user &&
                    'name' in user &&
                    'lastname' in user,
            );
            const opponent = !chat.isGroupChat
                ? participants.find((user) => user._id !== currentUserId)
                : undefined;
            const chatName = opponent
                ? textRefactor(getUserFullName(opponent), 25)
                : chat.chatName ?? chat.bot?.name ?? 'Untitled chat';
            const avatarUrl = opponent ? getUserAvatar(opponent) : undefined;

            return {
                id: chat._id,
                label: chatName,
                href: `${adminChatRoute}?chatId=${chat._id}`,
                avatarUrl,
            };
        });
    }, [adminChatRoute, chats, currentUserId]);

    const renderChatNav = (isOpen: boolean) => {
        if (isLoadingChats && recentChatLinks.length === 0) {
            return isOpen ? (
                <div className="px-3 py-2 text-sm text-white/60">Loading chats…</div>
            ) : null;
        }

        if (!isLoadingChats && recentChatLinks.length === 0) {
            return isOpen ? (
                <div className="px-3 py-2 text-sm text-white/60">No recent chats yet</div>
            ) : null;
        }

        return recentChatLinks.map((chat) => (
            <ChatNavItem
                key={chat.id}
                href={chat.href}
                label={chat.label}
                avatarUrl={chat.avatarUrl}
                open={isOpen}
            />
        ));
    };

    let content: React.ReactNode;

    if (!hasAttemptedAutoLogin) {
        content = (
            <div className="flex h-screen items-center justify-center bg-neutral-900 text-white">
                <span className="text-sm text-white/70">Checking authentication…</span>
            </div>
        );
    } else if (!isAuthenticated) {
        content = (
            <div className="flex h-screen flex-col items-center justify-center gap-4 bg-neutral-900 px-6 text-center text-white">
                <div className="max-w-sm space-y-2">
                    <h2 className="text-xl font-semibold text-white">Authentication required</h2>
                    <p className="text-sm text-white/70">
                        Please sign in to access the aiPair admin experience.
                    </p>
                </div>
                <Button onClick={() => uiStore.openAuthPopup()} variant="primary">
                    Sign in
                </Button>
            </div>
        );
    } else {
        content = (
            <div className="flex h-screen min-h-0 overflow-hidden bg-neutral-900 text-white">
                {/* ==== ЛЕВЫЙ САЙДБАР: ДЕСКТОП ==== */}
                <motion.aside
                    aria-label="Sidebar"
                    animate={{ width: w }}
                    transition={{ type: 'tween', duration: 0.25 }}
                    className="relative z-20 hidden h-full min-h-0 overflow-hidden md:flex flex-col border-r border-white/5 bg-neutral-950/70 backdrop-blur"
                    style={{ width: w }}
                >
                    <div className="flex items-center gap-2 px-3 py-3">
                        <Button
                            onClick={() => uiStore.toggleSidebar()}
                            variant="sidebarIcon"
                            aria-label={open ? 'Collapse' : 'Expand'}
                        >
                            {open ? <ChevronLeft /> : <Menu />}
                        </Button>
                        {open && <div className="px-3">MENU</div>}
                    </div>

                    <nav className="mt-2 flex flex-1 min-h-0 flex-col px-2">
                        <div className="space-y-1">
                            <NavItem
                                href={routes.createAgent}
                                label="Create aiPair"
                                icon={<PlusCircle className="size-5" />}
                                open={open}
                            />
                            <div className="mt-4 border-t border-white/5 pt-3" />
                            <NavItem href={routes.discover} label="Discover" icon={<Home className="size-5" />} open={open} />
                            <NavItem href={routes.adminChats} label="Chats" icon={<MessagesSquare className="size-5" />} open={open} />
                        </div>

                        <div className="mt-4 border-t border-white/5 pt-3" />
                        <SectionTitle open={open}>Recent chats</SectionTitle>

                        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                            <div className="space-y-1">{renderChatNav(open)}</div>
                        </div>
                    </nav>

                    <div className="mt-auto px-3 pb-3">
                        <ProfileSection open={open} />
                    </div>
                </motion.aside>

                {/* ==== МОБИЛЬНЫЙ САЙДБАР ==== */}
                <div className="md:hidden">
                    <div className="fixed top-0 left-0 right-0 z-40 flex items-center gap-3 border-b border-white/10 bg-neutral-900/90 px-3 py-3 backdrop-blur">
                        <Button
                            onClick={() => router.back()}
                            variant="sidebarIcon"
                            aria-label="Go back"
                        >
                            <ChevronLeft />
                        </Button>
                        <div className="flex-1">
                            <label className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                                <Search className="size-4 text-white/70" aria-hidden />
                                <input
                                    type="search"
                                    placeholder="Search"
                                    className="w-full bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
                                />
                            </label>
                        </div>
                        <Link
                            href={routes.myProfile}
                            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-400 text-sm font-semibold"
                            aria-label="Перейти в профиль"
                        >
                            {avatarInitial}
                        </Link>
                    </div>

                    {mobileOpen && (
                        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm">
                            <div className="absolute left-0 top-0 bottom-0 w-72 border-r border-white/10 bg-neutral-950/95 p-4">
                                <div className="flex items-center justify-between">
                                    <Logo />
                                    <Button
                                        onClick={() => uiStore.closeMobileSidebar()}
                                        variant="sidebarIcon"
                                        aria-label="Закрыть меню"
                                    >
                                        <ChevronLeft />
                                    </Button>
                                </div>
                                <nav className="mt-6 space-y-3">
                                    <Link href={routes.discover} className="block rounded-xl px-4 py-2 text-white/80 transition hover:bg-white/10">
                                        Discover
                                    </Link>
                                    <Link href={routes.adminChats} className="block rounded-xl px-4 py-2 text-white/80 transition hover:bg-white/10">
                                        Chats
                                    </Link>
                                    <Link href={routes.createAgent} className="block rounded-xl px-4 py-2 text-white/80 transition hover:bg-white/10">
                                        Create aiPair
                                    </Link>
                                </nav>
                            </div>
                        </div>
                    )}
                </div>

                {/* ==== ОСНОВНОЙ КОНТЕНТ ==== */}
                <main className="relative flex min-h-0 flex-1 flex-col">
                    <header className="hidden items-center justify-between border-b border-white/10 bg-neutral-900/80 px-6 py-4 backdrop-blur md:flex">
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => uiStore.toggleSidebar()}
                                variant="sidebarIcon"
                                aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
                            >
                                {open ? <ChevronLeft /> : <Menu />}
                            </Button>
                            <div className="hidden items-center gap-2 rounded-full bg-white/10 px-4 py-2 lg:flex">
                                <Search className="size-4 text-white/70" aria-hidden />
                                <input
                                    type="search"
                                    placeholder="Search"
                                    className="w-48 bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={() => uiStore.openAuthPopup()} variant="ghostPill">
                                Invite teammate
                            </Button>
                            <Link
                                href={routes.myProfile}
                                className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-400 text-sm font-semibold"
                                aria-label="Перейти в профиль"
                            >
                                {avatarInitial}
                            </Link>
                        </div>
                    </header>

                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                        <div className="flex-1 min-h-0 overflow-y-auto bg-gradient-to-br from-neutral-950 via-neutral-950 to-neutral-900">
                            {children}
                        </div>

                        <nav className="mt-auto grid grid-cols-3 items-center gap-4 border-t border-white/10 bg-neutral-950/90 px-6 py-3 text-xs text-white/60 md:hidden">
                            <Link href={routes.discover} className="flex flex-col items-center text-xs text-white/70">
                                <Home className="size-6" />
                            </Link>
                            <Link href={routes.createAgent} className="flex flex-col items-center text-xs text-white/70">
                                <PlusCircle className="size-6" />
                            </Link>
                            <Link href={routes.adminChats} className="flex flex-col items-center text-xs text-white/70">
                                <MessageSquare className="size-6" />
                            </Link>
                        </nav>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <>
            {content}
            <AuthPopupContainer />
        </>
    );
}

function NavItem({
    href,
    label,
    icon,
    open,
}: {
    href: string;
    label: string;
    icon: React.ReactNode;
    open: boolean;
}) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-white/10"
        >
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-white/10">
                {icon}
            </span>
            {open && <span className="truncate text-[15px]">{label}</span>}
        </Link>
    );
}

function SectionTitle({ children, open }: { children: React.ReactNode; open: boolean }) {
    if (!open) return null;
    return <div className="px-3 pb-1 text-xs uppercase tracking-wide text-white/50">{children}</div>;
}

function ChatNavItem({
    href,
    label,
    avatarUrl,
    open,
}: {
    href: string;
    label: string;
    avatarUrl?: string;
    open: boolean;
}) {
    const initials = label
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <Link
            href={href}
            className="group flex items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-white/10"
        >
            <div className="relative inline-flex size-9 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/10 text-sm font-semibold uppercase text-white">
                {avatarUrl ? (
                    <Image src={avatarUrl} alt={label} fill sizes="36px" className="object-cover" />
                ) : (
                    initials || label.charAt(0).toUpperCase()
                )}
            </div>
            {open && <span className="truncate text-[15px]">{label}</span>}
        </Link>
    );
}
