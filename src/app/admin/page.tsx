'use client';

import React, { useCallback, useMemo } from "react";
import CardRailTwoRows from "@/components/ui/CardRailTwoRows";
import AppShell from "@/components/AppShell";
import CardRailOneRow from "@/components/ui/CardRailOneRow";
import { Button } from "@/components/ui/Button";
import { useAuthRoutes, type AuthRouteKey } from "@/helpers/hooks/useAuthRoutes";
import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import type { CatalogItem } from "@/stores/CatalogStore";

type CardRailDisplayItem = Omit<CatalogItem, 'routeKey'> & { href: string };

const inputClasses =
  "w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/60";

const labelClasses = "text-xs font-medium uppercase tracking-wide text-white/50";

function renderPreviewItems(
  items: CatalogItem[],
  mapToCardRailItems: (items: CatalogItem[]) => CardRailDisplayItem[],
): CardRailDisplayItem[] {
  if (!items.length) {
    return [
      {
        id: 'empty',
        title: 'No cards yet',
        hoverText: 'Use the editor below to add your first AI.',
        src: '',
        href: '#',
      },
    ];
  }
  return mapToCardRailItems(items);
}

export default function Landing() {
  const { routes } = useAuthRoutes();
  const { catalogStore } = useRootStore();
  const categories = useStoreData(catalogStore, (store) => store.categories);
  const featuredCategoryId = useStoreData(catalogStore, (store) => store.featuredCategoryId);
  const featuredItems = useStoreData(catalogStore, (store) => store.featuredItems);

  const routeKeys = useMemo(() => Object.keys(routes) as AuthRouteKey[], [routes]);

  const mapToCardRailItems = useCallback(
    (items: CatalogItem[]): CardRailDisplayItem[] =>
      items.map(({ routeKey, ...rest }) => ({
        ...rest,
        href: routes[routeKey],
      })),
    [routes],
  );

  const previewByCategory = useMemo(
    () =>
      categories.map((category) => ({
        category,
        items: renderPreviewItems(category.items, mapToCardRailItems),
      })),
    [categories, mapToCardRailItems],
  );

  return (
    <AppShell>
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex-1 overflow-y-auto p-6 md:p-9">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
            <section className="space-y-8">
              <div>
                <h1 className="text-2xl font-semibold text-white">Catalog preview</h1>
                <p className="mt-2 text-sm text-white/60">
                  Changes you make below update instantly. Use it to experiment with different AI personas and imagery.
                </p>
              </div>
              <CardRailTwoRows
                title="Landing spotlight"
                items={renderPreviewItems(featuredItems, mapToCardRailItems)}
                className="mx-auto max-w-[1400px]"
              />
              <div className="space-y-12">
                {previewByCategory.map(({ category, items }) => (
                  <CardRailOneRow key={category.id} title={category.title} items={items} />
                ))}
              </div>
            </section>

            <section>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Manage your AI cards</h2>
                  <p className="mt-1 text-sm text-white/60">
                    Update titles, swap artwork, choose destinations, or remove personas entirely.
                  </p>
                </div>
                <Button variant="outline" onClick={() => catalogStore.addCategory('New category')}>
                  + Add category
                </Button>
              </div>

              <div className="mt-8 space-y-8">
                {categories.map((category) => (
                  <article
                    key={category.id}
                    className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/30 backdrop-blur md:p-8"
                  >
                    <header className="flex flex-col gap-4 border-b border-white/5 pb-5 md:flex-row md:items-center md:justify-between">
                      <div className="w-full md:max-w-sm">
                        <label className={labelClasses} htmlFor={`category-${category.id}`}>
                          Category title
                        </label>
                        <input
                          id={`category-${category.id}`}
                          className={inputClasses}
                          value={category.title}
                          onChange={(event) => catalogStore.setCategoryTitle(category.id, event.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-3 text-sm text-white/70 md:flex-row md:items-center">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="featured"
                            className="size-4 rounded-full border-white/40 bg-black/60 text-violet-500 focus:ring-violet-400"
                            checked={featuredCategoryId === category.id}
                            onChange={() => catalogStore.setFeaturedCategory(category.id)}
                          />
                          Featured on landing
                        </label>
                        <Button
                          variant="outlineMuted"
                          onClick={() => catalogStore.removeCategory(category.id)}
                          disabled={categories.length <= 1}
                        >
                          Remove category
                        </Button>
                      </div>
                    </header>

                    <div className="mt-6 space-y-6">
                      {category.items.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-white/10 bg-black/40 p-5 shadow-lg shadow-black/30 md:p-6"
                        >
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-3">
                              <div>
                                <label className={labelClasses} htmlFor={`title-${item.id}`}>
                                  Title
                                </label>
                                <input
                                  id={`title-${item.id}`}
                                  className={inputClasses}
                                  value={item.title}
                                  onChange={(event) =>
                                    catalogStore.updateItem(category.id, item.id, { title: event.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <label className={labelClasses} htmlFor={`views-${item.id}`}>
                                  Views / badge
                                </label>
                                <input
                                  id={`views-${item.id}`}
                                  className={inputClasses}
                                  value={item.views ?? ''}
                                  placeholder="e.g. 1.2K"
                                  onChange={(event) =>
                                    catalogStore.updateItem(category.id, item.id, { views: event.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <label className={labelClasses} htmlFor={`route-${item.id}`}>
                                  Destination route
                                </label>
                                <select
                                  id={`route-${item.id}`}
                                  className={inputClasses}
                                  value={item.routeKey}
                                  onChange={(event) =>
                                    catalogStore.updateItem(category.id, item.id, {
                                      routeKey: event.target.value as AuthRouteKey,
                                    })
                                  }
                                >
                                  {routeKeys.map((key) => (
                                    <option key={key} value={key} className="bg-neutral-900 text-white">
                                      {key}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <label className={labelClasses} htmlFor={`image-${item.id}`}>
                                  Image URL
                                </label>
                                <input
                                  id={`image-${item.id}`}
                                  className={inputClasses}
                                  value={item.src}
                                  placeholder="/img/example.png"
                                  onChange={(event) =>
                                    catalogStore.updateItem(category.id, item.id, { src: event.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <label className={labelClasses} htmlFor={`avatar-${item.id}`}>
                                  Avatar URL (optional)
                                </label>
                                <input
                                  id={`avatar-${item.id}`}
                                  className={inputClasses}
                                  value={item.avatarSrc ?? ''}
                                  placeholder="/img/avatar.png"
                                  onChange={(event) =>
                                    catalogStore.updateItem(category.id, item.id, { avatarSrc: event.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <label className={labelClasses} htmlFor={`hover-${item.id}`}>
                                  Hover text
                                </label>
                                <textarea
                                  id={`hover-${item.id}`}
                                  className={`${inputClasses} min-h-24 resize-none`}
                                  value={item.hoverText ?? ''}
                                  placeholder="Short line that appears on hover"
                                  onChange={(event) =>
                                    catalogStore.updateItem(category.id, item.id, { hoverText: event.target.value })
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-xs text-white/40">ID: {item.id}</span>
                            <Button
                              variant="outlineMuted"
                              onClick={() => catalogStore.removeItem(category.id, item.id)}
                            >
                              Remove card
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button variant="outline" onClick={() => catalogStore.addItem(category.id)}>
                        + Add AI card
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
