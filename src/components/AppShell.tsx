'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Menu, ChevronLeft, Home, Search, Archive, Bell, MessageSquare, Settings,
} from 'lucide-react';
import ProfileSection from './ProfileSection';

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
    const [open, setOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    // восстановим состояние свёрнутости между перезагрузками
    useEffect(() => {
        const v = localStorage.getItem('sidebar-open');
        if (v !== null) setOpen(v === '1');
    }, []);
    useEffect(() => {
        localStorage.setItem('sidebar-open', open ? '1' : '0');
    }, [open]);

    const w = useMemo(
        () => (open ? sidebarWidth : sidebarCollapsed),
        [open, sidebarWidth, sidebarCollapsed],
    );

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
                    <button
                        onClick={() => setOpen((s) => !s)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/15"
                        aria-label={open ? 'Collapse' : 'Expand'}
                    >
                        {open ? <ChevronLeft /> : <Menu />}
                    </button>
                    {open && <span className="text-lg font-semibold">talkie</span>}
                </div>

                {/* содержимое меню; при необходимости можно дать собственный вертикальный скролл */}
                <nav className="mt-2 flex-1 px-2">
                    <NavItem href="#" label="Discover" icon={<Home className="size-5" />} open={open} />
                    <div className="mt-4 border-t border-white/5 pt-3" />
                    <SectionTitle open={open}>Chats</SectionTitle>
                    <NavItem href="#" label="Sabine" icon={<MessageSquare className="size-5" />} open={open} />
                    <NavItem href="#" label="Peta" icon={<MessageSquare className="size-5" />} open={open} />
                    <NavItem href="#" label="Ginger" icon={<MessageSquare className="size-5" />} open={open} />
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
                <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-white/10 bg-neutral-900/80 px-3 py-3 backdrop-blur">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/15"
                        aria-label="Open menu"
                    >
                        <Menu />
                    </button>
                    <span className="text-lg font-semibold">talkie</span>
                </div>

                {mobileOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-30 bg-black/50"
                            onClick={() => setMobileOpen(false)}
                            aria-hidden
                        />
                        <motion.aside
                            initial={{ x: -320 }}
                            animate={{ x: 0 }}
                            exit={{ x: -320 }}
                            transition={{ type: 'tween', duration: 0.2 }}
                            className="fixed left-0 top-0 z-40 h-full w-[280px] border-r border-white/5 bg-neutral-950/90 p-3 backdrop-blur"
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-lg font-semibold">Menu</span>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/15"
                                    aria-label="Close menu"
                                >
                                    <ChevronLeft />
                                </button>
                            </div>
                            <nav className="space-y-1">
                                <NavItem href="#" label="Discover" icon={<Home className="size-5" />} open />
                                <NavItem href="#" label="Search" icon={<Search className="size-5" />} open />
                                <NavItem href="#" label="Memory" icon={<Archive className="size-5" />} open />
                                <NavItem href="#" label="Notification" icon={<Bell className="size-5" />} open />
                                <div className="mt-4 border-t border-white/5 pt-3" />
                                <SectionTitle open>Chats</SectionTitle>
                                <NavItem href="#" label="Sabine" icon={<MessageSquare className="size-5" />} open />
                                <NavItem href="#" label="Peta" icon={<MessageSquare className="size-5" />} open />
                                <NavItem href="#" label="Ginger" icon={<MessageSquare className="size-5" />} open />
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

                <div className="p-4 md:p-6">{children}</div>
            </main>
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
