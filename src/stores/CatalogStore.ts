import { makeAutoObservable } from 'mobx';
import { BaseStore } from './BaseStore';
import type { RootStore } from './RootStore';
import type { AuthRouteKey } from '@/helpers/hooks/useAuthRoutes';

export type CatalogItem = {
  id: string;
  title: string;
  src: string;
  avatarSrc?: string;
  views?: string;
  hoverText?: string;
  routeKey: AuthRouteKey;
  cardWidth?: string;
};

export type CatalogCategory = {
  id: string;
  title: string;
  items: CatalogItem[];
};

const initialCategories: CatalogCategory[] = [
  {
    id: 'teachers',
    title: 'Teachers',
    items: [
      {
        id: 'teachers-1',
        cardWidth: '200',
        src: '/img/mizuhara.png',
        title: 'aiAgent α',
        views: 'Profile',
        hoverText: 'View the creator dossier.',
        routeKey: 'aiAgentProfile',
      },
      {
        id: 'teachers-2',
        src: '/img/mizuhara.png',
        title: 'Emily',
        views: '1.2K',
        hoverText: 'Your little sister... Always on your side.',
        routeKey: 'chatEmily',
      },
      {
        id: 'teachers-3',
        src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg',
        title: 'Tristan',
        views: '932',
        hoverText: 'Sirens — everyone has one story to tell.',
        routeKey: 'chatTristan',
      },
    ],
  },
  {
    id: 'romantic',
    title: 'Romantic',
    items: [
      {
        id: 'romantic-1',
        src: '/img/mizuhara.png',
        title: 'Celeste',
        views: '726',
        hoverText: 'Soft-spoken poet with galaxies in her pocket.',
        routeKey: 'adminChat',
      },
      {
        id: 'romantic-2',
        src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg',
        title: 'Iris',
        views: '1.1K',
        hoverText: 'Wandering botanist who sends you pressed flowers.',
        routeKey: 'adminChat',
      },
    ],
  },
  {
    id: 'story',
    title: 'Story',
    items: [
      {
        id: 'story-1',
        src: '/img/mizuhara.png',
        title: 'Ginger',
        views: '539',
        hoverText: 'Street photographer who only shoots at night.',
        routeKey: 'adminChat',
      },
      {
        id: 'story-2',
        src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg',
        title: 'Sabine',
        views: '847',
        hoverText: 'Runaway heiress looking for a partner in crime.',
        routeKey: 'adminChat',
      },
      {
        id: 'story-3',
        src: '/img/mizuhara.png',
        title: 'Peta',
        views: '412',
        hoverText: 'Archivist who remembers every story ever told.',
        routeKey: 'adminChat',
      },
    ],
  },
  {
    id: 'fun',
    title: 'For fun',
    items: [
      {
        id: 'fun-1',
        src: '/img/mizuhara.png',
        title: 'Angelina',
        views: '1.8K',
        hoverText: "I'll wait for you at the bar. Don't keep me waiting 💋",
        routeKey: 'adminChat',
      },
      {
        id: 'fun-2',
        src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg',
        title: 'Layla',
        views: '623',
        hoverText: 'Highway patrol officer with a mischievous streak.',
        routeKey: 'adminChat',
      },
      {
        id: 'fun-3',
        src: '/img/mizuhara.png',
        title: 'Lisa',
        views: '998',
        hoverText: "That's not the point. You're not listening to me.",
        routeKey: 'adminChat',
      },
      {
        id: 'fun-4',
        src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg',
        title: 'Margerett',
        views: '712',
        hoverText: "Well I'm not sure if that's a good idea, I have doubts...",
        routeKey: 'adminChat',
      },
    ],
  },
];

export class CatalogStore extends BaseStore {
  private root: RootStore;

  categories: CatalogCategory[] = initialCategories;
  featuredCategoryId: string = initialCategories[0]?.id ?? 'teachers';

  constructor(root: RootStore) {
    super();
    this.root = root;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get featuredCategory(): CatalogCategory | undefined {
    return this.categories.find((category) => category.id === this.featuredCategoryId);
  }

  get featuredItems(): CatalogItem[] {
    return this.featuredCategory?.items ?? [];
  }

  private generateId(prefix: string) {
    return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now()}`;
  }

  private cloneCategories() {
    return this.categories.map((category) => ({
      ...category,
      items: category.items.map((item) => ({ ...item })),
    }));
  }

  setFeaturedCategory(categoryId: string) {
    if (this.categories.some((category) => category.id === categoryId)) {
      this.featuredCategoryId = categoryId;
      this.notify();
    }
  }

  addCategory(title: string) {
    const id = this.generateId('category');
    const nextCategories = [
      ...this.cloneCategories(),
      {
        id,
        title,
        items: [],
      },
    ];
    this.categories = nextCategories;
    if (!this.featuredCategoryId) {
      this.featuredCategoryId = id;
    }
    this.notify();
    return id;
  }

  removeCategory(categoryId: string) {
    const nextCategories = this.cloneCategories().filter((category) => category.id !== categoryId);
    this.categories = nextCategories;
    if (this.featuredCategoryId === categoryId) {
      this.featuredCategoryId = nextCategories[0]?.id ?? '';
    }
    this.notify();
  }

  setCategoryTitle(categoryId: string, title: string) {
    const nextCategories = this.cloneCategories();
    const target = nextCategories.find((category) => category.id === categoryId);
    if (!target) return;
    target.title = title;
    this.categories = nextCategories;
    this.notify();
  }

  addItem(categoryId: string) {
    const nextCategories = this.cloneCategories();
    const target = nextCategories.find((category) => category.id === categoryId);
    if (!target) return;

    const item: CatalogItem = {
      id: this.generateId('item'),
      title: 'New AI agent',
      src: '',
      hoverText: '',
      views: '',
      routeKey: 'placeholder',
    };

    target.items = [...target.items, item];
    this.categories = nextCategories;
    this.notify();
    return item.id;
  }

  updateItem(categoryId: string, itemId: string, updates: Partial<CatalogItem>) {
    const nextCategories = this.cloneCategories();
    const target = nextCategories.find((category) => category.id === categoryId);
    if (!target) return;
    const itemIndex = target.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) return;
    const updatedItem = { ...target.items[itemIndex], ...updates };
    target.items = [
      ...target.items.slice(0, itemIndex),
      updatedItem,
      ...target.items.slice(itemIndex + 1),
    ];
    this.categories = nextCategories;
    this.notify();
  }

  removeItem(categoryId: string, itemId: string) {
    const nextCategories = this.cloneCategories();
    const target = nextCategories.find((category) => category.id === categoryId);
    if (!target) return;
    target.items = target.items.filter((item) => item.id !== itemId);
    this.categories = nextCategories;
    this.notify();
  }
}

