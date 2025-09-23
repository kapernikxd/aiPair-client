'use client';

import React, { useRef } from 'react';
import HoverSwapCard from './AiCard';

type Item = {
  id: string | number;
  src: string;
  avatarSrc?: string;
  title: string;
  views?: number | string;
  hoverText?: string;
  href?: string;
};

type Props = {
  items: Item[];
  cardWidth?: number;   // px, для кнопок пролистывания
  gap?: number;         // px
  className?: string;
};

export default function CardRailTwoRows({
  items,
  cardWidth = 220,
  gap = 16,
  className = '',
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({
      left: dir * (cardWidth * 2 + gap * 2), // листаем «две карточки»
      behavior: 'smooth',
    });
  };

  return (
    <section className={`relative ${className}`}>
      {/* Кнопки пролистывания (опционально) */}
      <button
        aria-label="Prev"
        onClick={() => scrollBy(-1)}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
      >
        ‹
      </button>
      <button
        aria-label="Next"
        onClick={() => scrollBy(1)}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
      >
        ›
      </button>

      {/* Сам скроллер */}
      <div
        ref={scrollerRef}
        className="overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] snap-x snap-mandatory"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Прячем полосы прокрутки в WebKit */}
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Двухрядная сетка, которая тянется по горизонтали */}
        <div
          className="
            grid
            grid-rows-2
            auto-cols-max
            [grid-auto-flow:column]
            gap-4 md:gap-5
            p-2 md:p-3
          "
          // фиксируем ширину колонки на ширину карточки
          style={{
            gridAutoColumns: `${cardWidth}px`,
            columnGap: `${gap}px`,
            rowGap: `${gap}px`,
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
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
