'use client';

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import {
    Menu,
    ChevronLeft,
    Home,
    Search,
    Archive,
    Bell,
    MessageSquare,
    UserRound,
    PlusCircle,
} from 'lucide-react';
import { useAuthRoutes } from '@/helpers/hooks/useAuthRoutes';
import ProfileSection from './ProfileSection';
import { useRootStore, useStoreData } from '@/stores/StoreProvider';
import { getUserFullName } from '@/helpers/utils/user';

type AppShellProps = {
    children: React.ReactNode;
    sidebarWidth?: number;     // ширина раскрытого меню (px)
    sidebarCollapsed?: number; // ширина свернутого меню (px)
};

export default function AppShell({
    children,
    sidebarWidth = 280,
    sidebarCollapsed = 80,
}: AppShellProps) {
    const { routes } = useAuthRoutes();

    const { uiStore, profileStore, authStore } = useRootStore();
    const open = useStoreData(uiStore, (store) => store.isSidebarOpen);
    const mobileOpen = useStoreData(uiStore, (store) => store.isMobileSidebarOpen);
  
    const profile = useStoreData(profileStore, (store) => store.profile);
    const profileName = useStoreData(profileStore, (store) => store.profile.userName);
    const profileInitial = profile?.name?.[0]?.toUpperCase() ?? 'U';
  
    const authUser = useStoreData(authStore, (store) => store.user);
    const isAuthenticated = useStoreData(authStore, (store) => store.isAuthenticated);
    const avatarInitial = (authUser?.name ?? profileName ?? 'U').charAt(0).toUpperCase();

    const chats = useStoreData(chatStore, (store) => store.chats);
    const isLoadingChats = useStoreData(chatStore, (store) => store.isLoadingChats);
    const currentUserId = useStoreData(authStore, (store) => store.user?.id ?? '');

    useEffect(() => {
        uiStore.hydrateSidebarFromStorage();
    }, [uiStore]);

    useEffect(() => {
        if (!chatStore.chats.length && !chatStore.isLoadingChats) {
            void chatStore.fetchChats({ page: 1 });
        }
    }, [chatStore]);

    const w = useMemo(
        () => (open ? sidebarWidth : sidebarCollapsed),
        [open, sidebarWidth, sidebarCollapsed],
    );

    const adminChatRoute = routes.adminChat;

    const recentChatLinks = useMemo(() => {
        type ChatParticipant = { _id: string; name: string; lastname: string };

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
                ? getUserFullName(opponent)
                : chat.chatName ?? chat.bot?.name ?? 'Untitled chat';

            return {
                id: chat._id,
                label: chatName,
                href: `${adminChatRoute}?chatId=${chat._id}`,
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
            <NavItem
                key={chat.id}
                href={chat.href}
                label={chat.label}
                icon={<MessageSquare className="size-5" />}
                open={isOpen}
            />
        ));
    };

    return (
        // Внешний скролл отключен: скроллится только правый main
        <div className="flex h-screen overflow-hidden bg-neutral-900 text-white">
            {/* ==== ЛЕВЫЙ САЙДБАР: ДЕСКТОП ==== */}
            <motion.aside
                aria-label="Sidebar"
                animate={{ width: w }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="relative z-20 hidden h-full md:flex flex-col border-r border-white/5 bg-neutral-950/70 backdrop-blur"
                style={{ width: w }}
            >
                {/* верх панели */}
                <div className="flex items-center gap-2 px-3 py-3">
                    <Button
                        onClick={() => uiStore.toggleSidebar()}
                        variant="sidebarIcon"
                        aria-label={open ? 'Collapse' : 'Expand'}
                    >
                        {open ? <ChevronLeft /> : <Menu />}
                    </Button>
                    {open && <span className="text-lg font-semibold">talkie</span>}
                </div>

                {/* содержимое меню; при необходимости можно дать собственный вертикальный скролл */}
                <nav className="mt-2 flex-1 px-2">
                    <NavItem href={routes.discover} label="Discover" icon={<Home className="size-5" />} open={open} />
                    <NavItem
                        href={routes.createAgent}
                        label="Create aiAgent"
                        icon={<PlusCircle className="size-5" />}
                        open={open}
                    />
                    <NavItem href={routes.aiAgentProfile} label="aiAgent α" icon={<MessageSquare className="size-5" />} open={open} />
                    <NavItem href={routes.userProfile} label="Keyser Soze" icon={<UserRound className="size-5" />} open={open} />
                    <div className="mt-4 border-t border-white/5 pt-3" />
                    <SectionTitle open={open}>Chats</SectionTitle>
                    {renderChatNav(open)}
                </nav>

                <div className="mt-4 border-t border-white/5 pt-3" />
                {/* низ сайдбара — профиль */}
                <div className="mt-auto px-3 pb-3">
                    <ProfileSection open={open} />
                </div>
            </motion.aside>

            {/* ==== МОБИЛЬНЫЙ САЙДБАР ==== */}
            <div className="md:hidden">
                {/* верхняя панель с кнопкой открытия */}
                <div className="fixed top-0 left-0 right-0 z-40 flex items-center gap-3 border-b border-white/10 bg-neutral-900/90 px-3 py-3 backdrop-blur">
                    <Button
                        onClick={() => uiStore.openMobileSidebar()}
                        variant="sidebarIcon"
                        aria-label="Open menu"
                    >
                        <Menu />
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
                    {isAuthenticated ? (
                        <Link
                            href={routes.myProfile}
                            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-400 text-sm font-semibold"
                            aria-label="Перейти в профиль"
                        >
                            {avatarInitial}
                        </Link>
                    ) : (
                        <Button
                            onClick={() => uiStore.openAuthPopup()}
                            variant="ghostRounded"
                            className="h-10 px-3 text-xs font-semibold"
                        >
                            Авторизоваться
                        </Button>
                    )}
                </div>

                {mobileOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-30 bg-black/50"
                            onClick={() => uiStore.closeMobileSidebar()}
                            aria-hidden
                        />
                        <motion.aside
                            initial={{ x: -320 }}
                            animate={{ x: 0 }}
                            exit={{ x: -320 }}
                            transition={{ type: 'tween', duration: 0.2 }}
                            className="fixed left-0 top-0 z-50 h-full w-[280px] border-r border-white/5 bg-neutral-950/90 p-3 backdrop-blur"
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-lg font-semibold">Menu</span>
                                <Button
                                    onClick={() => uiStore.closeMobileSidebar()}
                                    variant="sidebarIcon"
                                    aria-label="Close menu"
                                >
                                    <ChevronLeft />
                                </Button>
                            </div>
                            <nav className="space-y-1">
                                <NavItem href={routes.discover} label="Discover" icon={<Home className="size-5" />} open />
                                <NavItem
                                    href={routes.createAgent}
                                    label="Create aiAgent"
                                    icon={<PlusCircle className="size-5" />}
                                    open
                                />
                                <NavItem href={routes.aiAgentProfile} label="aiAgent α" icon={<MessageSquare className="size-5" />} open />
                                <NavItem href={routes.userProfile} label="Keyser Soze" icon={<UserRound className="size-5" />} open />
                                <NavItem href={routes.placeholder} label="Search" icon={<Search className="size-5" />} open />
                                <NavItem href={routes.placeholder} label="Memory" icon={<Archive className="size-5" />} open />
                                <NavItem href={routes.placeholder} label="Notification" icon={<Bell className="size-5" />} open />
                                <div className="mt-4 border-t border-white/5 pt-3" />
                                <SectionTitle open>Chats</SectionTitle>
                                {renderChatNav(true)}
                            </nav>

                            <div className="mt-4">
                                <ProfileSection open />
                            </div>
                        </motion.aside>
                    </>
                )}
            </div>

            {/* ==== ПРАВЫЙ КОНТЕНТ (СКРОЛЛ ТУТ) ==== */}
            <main className="flex-1 h-full overflow-hidden">
                {/* липкий топбар внутри правой колонки */}
                <div className="sticky top-0 z-10 hidden md:flex items-center justify-between border-b border-white/10 bg-neutral-900/70 px-5 py-3 backdrop-blur">
                    <div className="text-sm text-white/70">For You</div>
                    <div className="text-sm text-white/50">Right content header</div>
                </div>

                <div className="flex h-full min-h-0 flex-col pt-[67px] md:pt-0">{children}</div>
            </main>

            {/* ==== МОБИЛЬНОЕ НИЖНЕЕ МЕНЮ ==== */}
            <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-white/10 bg-neutral-950/90 py-3 backdrop-blur md:hidden">
                <Link
                    href={routes.home}
                    className="flex flex-col items-center text-xs text-white/70"
                >
                    <Home className="size-6" />
                </Link>
                <Link
                    href={routes.createAgent}
                    className="flex flex-col items-center text-xs text-white/70"
                >
                    <PlusCircle className="size-6" />
                </Link>
                <Link
                    href={routes.adminChats}
                    className="flex flex-col items-center text-xs text-white/70"
                >
                    <MessageSquare className="size-6" />
                </Link>
            </nav>
        </div>
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
            className="group flex items-center gap-3 rounded-2xl px-3 py-2 hover:bg-white/10 transition"
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
    return (
        <div className="px-3 pb-1 text-xs uppercase tracking-wide text-white/50">
            {children}
        </div>
    );
}
