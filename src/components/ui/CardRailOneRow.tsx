'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import HoverSwapCard from '../AiCard';
import { useTranslations } from '@/localization/TranslationProvider';

type Item = {
  id: string | number;
  src: string;
  avatarSrc?: string;
  title: string;
  views?: number | string;
  hoverText?: string;
  href?: string;
  onChatNow?: () => void;
  isChatLoading?: boolean;
};

type Props = {
  items: Item[];
  title?: string;       // 🔑 новый проп для заголовка
  cardWidth?: number;   // px
  gap?: number;         // px
  className?: string;
};

export default function CardRailOneRow({
  items,
  title,
  cardWidth = 220,
  gap = 16,
  className = '',
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslations();

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({
      left: dir * (cardWidth + gap),
      behavior: 'smooth',
    });
  };

  return (
    <section className={`relative ${className}`}>
      {/* Заголовок */}
      {title && (
        <h2 className="mb-3 text-lg font-semibold text-white flex items-center gap-2 px-3 md:px-0">
          {title}
          <span className="text-yellow-400">✨</span>
        </h2>
      )}

      {/* Кнопки пролистывания */}
      <div className="hidden md:flex absolute left-2 top-1/2 z-10 -translate-y-1/2">
        <Button aria-label={t('common.prev', 'Prev')} onClick={() => scrollBy(-1)} variant="carouselNav">
          ‹
        </Button>
      </div>
      <div className="hidden md:flex absolute right-2 top-1/2 z-10 -translate-y-1/2">
        <Button aria-label={t('common.next', 'Next')} onClick={() => scrollBy(1)} variant="carouselNav">
          ›
        </Button>
      </div>

      {/* Скроллер */}
      <div
        ref={scrollerRef}
        className="overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] snap-x snap-mandatory"
        style={{ scrollBehavior: 'smooth' }}
      >
        <style>{` div::-webkit-scrollbar { display: none; } `}</style>

        <div
          className="
            grid
            grid-rows-1
            auto-cols-max
            [grid-auto-flow:column]
            gap-4 md:gap-5
            p-2 md:p-3
          "
          style={{
            gridAutoColumns: `${cardWidth}px`,
            columnGap: `${gap}px`,
          }}
        >
          {items.map((it) => (
            <div key={it.id} className="snap-start">
              <HoverSwapCard
                src={it.src}
                avatarSrc={it.avatarSrc}
                title={it.title}
                views={it.views}
                hoverText={it.hoverText}
                href={it.href}
                onChatNow={it.onChatNow}
                isChatLoading={it.isChatLoading}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
