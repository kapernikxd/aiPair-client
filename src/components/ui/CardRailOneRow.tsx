'use client';

import React, { ReactNode, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import HoverSwapCard from '../AiCard';

type CardRailItem = {
  id?: string | number;
  src?: string;
  avatarSrc?: string;
  title?: string;
  views?: number | string;
  hoverText?: string;
  href?: string;
};

type CardRailOneRowProps<T extends CardRailItem = CardRailItem> = {
  items: T[];
  title?: string;
  description?: ReactNode;
  titleAdornment?: ReactNode;
  isLoading?: boolean;
  loadingMessage?: ReactNode;
  emptyMessage?: ReactNode;
  cardWidth?: number;
  gap?: number;
  className?: string;
  contentClassName?: string;
  scrollerClassName?: string;
  gridClassName?: string;
  itemClassName?: string;
  showNavigationButtons?: boolean;
  renderItem?: (item: T, index: number) => ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
};

const defaultMessageClassName =
  'rounded-3xl border border-white/10 bg-neutral-900/60 p-6 text-sm text-white/60';

const defaultTitleAdornment = <span className="text-yellow-400">✨</span>;

export default function CardRailOneRow<T extends CardRailItem = CardRailItem>({
  items,
  title,
  description,
  titleAdornment,
  isLoading = false,
  loadingMessage = 'Loading…',
  emptyMessage = 'No items to display yet.',
  cardWidth = 220,
  gap = 16,
  className = '',
  contentClassName = '',
  scrollerClassName = '',
  gridClassName = '',
  itemClassName = '',
  showNavigationButtons = true,
  renderItem,
  getItemKey,
}: CardRailOneRowProps<T>) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({
      left: dir * (cardWidth + gap),
      behavior: 'smooth',
    });
  };

  const resolvedTitleAdornment =
    titleAdornment === undefined ? defaultTitleAdornment : titleAdornment;

  const hasHeader = Boolean(title || description);
  const hasItems = items.length > 0;
  const shouldShowNav =
    showNavigationButtons && hasItems && items.length > 1 && !isLoading;

  const defaultRenderItem = (item: CardRailItem) => (
    <HoverSwapCard
      src={item.src ?? ''}
      avatarSrc={item.avatarSrc}
      title={item.title ?? ''}
      views={item.views}
      hoverText={item.hoverText}
      href={item.href}
    />
  );

  const renderCard = renderItem ?? (defaultRenderItem as (item: T, index: number) => ReactNode);
  const getKey =
    getItemKey ??
    ((item: T, index: number) => {
      if (typeof item === 'object' && item !== null && 'id' in item && item.id !== undefined) {
        return item.id as string | number;
      }

      return index;
    });

  const renderMessage = (message: ReactNode) =>
    typeof message === 'string' ? (
      <div className={defaultMessageClassName}>{message}</div>
    ) : (
      message
    );

  let content: ReactNode;

  if (isLoading) {
    content = renderMessage(loadingMessage);
  } else if (!hasItems) {
    content = renderMessage(emptyMessage);
  } else {
    content = (
      <>
        {shouldShowNav && (
          <div className="hidden md:flex absolute left-2 top-1/2 z-10 -translate-y-1/2">
            <Button aria-label="Previous" onClick={() => scrollBy(-1)} variant="carouselNav">
              ‹
            </Button>
          </div>
        )}
        {shouldShowNav && (
          <div className="hidden md:flex absolute right-2 top-1/2 z-10 -translate-y-1/2">
            <Button aria-label="Next" onClick={() => scrollBy(1)} variant="carouselNav">
              ›
            </Button>
          </div>
        )}
        <div
          ref={scrollerRef}
          className={`overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] snap-x snap-mandatory ${scrollerClassName}`}
          style={{ scrollBehavior: 'smooth' }}
        >
          <style>{` div::-webkit-scrollbar { display: none; } `}</style>

          <div
            className={`grid grid-rows-1 auto-cols-max [grid-auto-flow:column] gap-4 md:gap-5 p-2 md:p-3 ${gridClassName}`}
            style={{
              gridAutoColumns: `${cardWidth}px`,
              columnGap: `${gap}px`,
            }}
          >
            {items.map((item, index) => (
              <div key={getKey(item, index)} className={`snap-start ${itemClassName}`}>
                {renderCard(item, index)}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  const contentWrapperClassName = [hasHeader ? 'mt-4' : '', contentClassName]
    .join(' ')
    .trim();

  return (
    <section className={`relative ${className}`}>
      {hasHeader && (
        <div className="flex flex-col gap-1">
          {title && (
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              {title}
              {resolvedTitleAdornment}
            </h2>
          )}
          {description && <p className="text-sm text-white/70">{description}</p>}
        </div>
      )}

      <div className={contentWrapperClassName}>{content}</div>
    </section>
  );
}
