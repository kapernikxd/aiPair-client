import { makeAutoObservable, runInAction } from 'mobx';
import { BaseStore } from './BaseStore';
import type { RootStore } from './RootStore';
import { MAX_GALLERY_ITEMS, steps } from '@/helpers/data/agent-create';
import type { FormState, GalleryItem } from '@/helpers/types/agent-create';
import { revokeGallery, revokeIfNeeded } from '@/helpers/utils/agent-create';
import { AiBotDetails, AiBotDTO } from '@/helpers/types/dtos/AiBotDto';
import { AiBotMainPageBot } from '@/helpers/types';
import { UserDTO } from '@/helpers/types';
import { AvatarFile, ProfilesFilterParams } from '@/helpers/types/profile';
import ProfileService, { AiBotUpdatePayload } from '@/services/profile/ProfileService';
import AiBotDetailsService from '@/services/ai-bot-details/AiBotDetailsService';

export type AiAgentHeader = {
  name: string;
  curatorLabel: string;
  tagline: string;
  avatarSrc: string;
};

export class AiBotStore extends BaseStore {
  private root: RootStore;
  step = 0;
  form: FormState = {
    firstName: '',
    lastName: '',
    prompt: '',
    description: '',
    intro: '',
    categories: [],
    usefulness: [],
  };
  avatar: File | null = null;
  avatarPreview: string | null = null;
  gallery: GalleryItem[] = [];
  completed = false;
  readonly maxGalleryItems = MAX_GALLERY_ITEMS;

  private profileService = ProfileService;
  private aiBotDetailsService = AiBotDetailsService;

  createdBot: UserDTO | null = null;
  isSubmitting = false;
  creationError: string | null = null;

  selectAiBot: AiBotDTO | null = null;
  userAiBots: AiBotDTO[] = [];
  botPhotos: string[] = [];
  botDetails: AiBotDetails | null = null;

  myBots: UserDTO[] = [];
  subscribedBots: UserDTO[] = [];
  photosLoading = false;
  photosUpdating = false;
  isAiUserLoading = false;

  mainPageBots: AiBotMainPageBot[] = [];
  isLoadingMainPageBots = false;
  mainPageBotsError: string | null = null;

  bots: UserDTO[] = [];
  isLoadingAiProfiles = false;
  hasMoreAiProfiles = false;

  constructor(root: RootStore) {
    super();
    this.root = root;
    makeAutoObservable(this);
  }

  get steps() {
    return steps;
  }

  get currentStepComplete(): boolean {
    switch (this.step) {
      case 0:
        return Boolean(
          this.form.firstName.trim() &&
          this.form.lastName.trim() &&
          (this.avatar !== null || this.avatarPreview !== null),
        );
      case 1:
        return this.form.categories.length > 0 && this.form.usefulness.length > 0;
      case 2:
        return Boolean(
          this.form.prompt.trim() &&
          this.form.description.trim() &&
          this.form.intro.trim(),
        );
      default:
        return this.gallery.length > 0;
    }
  }

  setStep(step: number) {
    if (step === this.step) return;
    this.step = step;
    this.completed = false;
    this.creationError = null;
    this.notify();
  }

  setFormField<K extends keyof FormState>(field: K, value: FormState[K]) {
    this.form = { ...this.form, [field]: value };
    this.notify();
  }

  private replaceAvatarPreview(preview: string | null) {
    if (this.avatarPreview && this.avatarPreview !== preview) {
      revokeIfNeeded(this.avatarPreview);
    }
    this.avatarPreview = preview;
  }

  setAvatar(file: File | null) {
    if (!file) {
      this.avatar = null;
      this.replaceAvatarPreview(null);
      this.notify();
      return;
    }
    const preview = URL.createObjectURL(file);
    this.avatar = file;
    this.replaceAvatarPreview(preview);
    this.notify();
  }

  addGalleryItems(files: File[]) {
    if (!files.length) return;
    const remaining = Math.max(0, this.maxGalleryItems - this.gallery.length);
    if (remaining === 0) return;
    const allowed = files.slice(0, remaining);
    const mapped = allowed.map((file, index) => ({
      id: `${file.name}-${Date.now()}-${index}`,
      preview: URL.createObjectURL(file),
      file,
    }));
    this.gallery = [...this.gallery, ...mapped];
    this.notify();
  }

  removeGalleryItem(id: string) {
    const target = this.gallery.find((item) => item.id === id);
    if (target) {
      revokeIfNeeded(target.preview);
    }
    this.gallery = this.gallery.filter((item) => item.id !== id);
    this.notify();
  }

  goNext() {
    if (!this.currentStepComplete) return;
    if (this.step < this.steps.length - 1) {
      this.setStep(this.step + 1);
    } else {
      this.completed = true;
      this.notify();
    }
  }

  goPrev() {
    if (this.step === 0) return;
    this.setStep(this.step - 1);
  }

  resetFlow() {
    revokeGallery(this.gallery);
    this.form = {
      firstName: '',
      lastName: '',
      prompt: '',
      description: '',
      intro: '',
      categories: [],
      usefulness: [],
    };
    this.avatar = null;
    this.replaceAvatarPreview(null);
    this.gallery = [];
    this.step = 0;
    this.completed = false;
    this.creationError = null;
    this.createdBot = null;
    this.isSubmitting = false;
    this.notify();
  }

  dispose() {
    this.replaceAvatarPreview(null);
    revokeGallery(this.gallery);
    this.gallery = [];
  }

  async fetchAllAiBots(params: ProfilesFilterParams = {}) {
    const page = params.page ?? 1;
    const limit = params.limit;

    if (this.isLoadingAiProfiles || (!this.hasMoreAiProfiles && page > 1)) return;

    this.isLoadingAiProfiles = true;
    try {
      const { data } = await this.profileService.getAllAiBots({ page, limit });
      runInAction(() => {
        // Если это первая страница — заменяем события
        if (page === 1) {
          this.bots = data.profiles;
          // Если загружаем следующую страницу — добавляем к существующим
        } else {
          this.bots = [...this.bots, ...data.profiles];
        }
        this.hasMoreAiProfiles = data.hasMore; // Флаг, есть ли еще данные
      });
    } catch (error) {
      console.error("Error fetching ai profiles", error);
    } finally {
      runInAction(() => {
        this.isLoadingAiProfiles = false;
      });
    }
  }

  async fetchMainPageBots() {
    if (this.isLoadingMainPageBots) {
      return;
    }

    this.isLoadingMainPageBots = true;
    this.mainPageBotsError = null;
    this.notify();

    try {
      const { data } = await this.aiBotDetailsService.fetchAiBotsForMainPage();
      runInAction(() => {
        this.mainPageBots = data ?? [];
      });
      this.notify();
      return this.mainPageBots;
    } catch (error) {
      console.error("Failed to load AI bots for admin main page", error);
      runInAction(() => {
        this.mainPageBots = [];
        this.mainPageBotsError = "Не удалось загрузить список ботов. Попробуйте обновить страницу позже.";
      });
      this.notify();
    } finally {
      runInAction(() => {
        this.isLoadingMainPageBots = false;
      });
      this.notify();
    }
  }

  async fetchAiBotById(id: string) {
    this.isAiUserLoading = true;
    this.notify();
    try {
      const { data } = await this.profileService.getAiBotById(id);
      runInAction(() => {
        this.selectAiBot = data;
      });
      this.notify();
      return data;
    } catch (e) {
      runInAction(() => {
        this.selectAiBot = null;
      });
      this.notify();
      this.root.uiStore.showSnackbar("Failed", "error");
    } finally {
      runInAction(() => {
        this.isAiUserLoading = false;
      });
      this.notify();
    }
  }

  async fetchAiBotsByUserId(userId: string) {
    this.isAiUserLoading = true;
    this.notify();
    try {
      const { data } = await this.profileService.getAiBotsByCreator(userId);
      runInAction(() => {
        this.userAiBots = data;
      });
      this.notify();
      return data;
    } catch (e) {
      runInAction(() => {
        this.userAiBots = [];
      });
      this.notify();
    } finally {
      runInAction(() => {
        this.isAiUserLoading = false;
      });
      this.notify();
    }
  }

  clearSelectedAiBot() {
    this.selectAiBot = null;
    this.notify();
  }

  clearUserAiBots() {
    this.userAiBots = [];
    this.notify();
  }

  async fetchMyAiBots() {
    try {
      const { data } = await this.profileService.getMyAiBots();
      runInAction(() => {
        this.myBots = data;
        this.notify();
      });
    } catch (e) {
      this.root.uiStore.showSnackbar("Failed", "error");
    }
  }

  async fetchSubscribedAiBots() {
    try {
      const { data } = await this.profileService.getSubscribedAiBots();
      runInAction(() => {
        this.subscribedBots = data;
        this.notify();
      });
    } catch (e) {
      this.root.uiStore.showSnackbar("Failed", "error");
    }
  }

  async followAiBot(id: string) {
    try {
      const { data } = await this.profileService.followAiBotById(id);
      runInAction(() => {
        const updateFollowers = <T extends UserDTO>(collection: T[]) =>
          collection.map((bot) => (bot._id === id ? ({ ...bot, followers: data.followers } as T) : bot));

        this.myBots = updateFollowers(this.myBots);
        this.userAiBots = updateFollowers(this.userAiBots);
        this.bots = updateFollowers(this.bots);

        if (this.selectAiBot && this.selectAiBot._id === id) {
          this.selectAiBot = { ...this.selectAiBot, followers: data.followers, isFollowing: data.isFollowing };
        }

        if (this.botDetails) {
          this.botDetails = { ...this.botDetails, isFollowing: data.isFollowing };
        }

        if (data.isFollowing) {
          const existsInSubscribed = this.subscribedBots.some((bot) => bot._id === id);
          const botToAdd =
            this.selectAiBot && this.selectAiBot._id === id
              ? this.selectAiBot
              : this.userAiBots.find((bot) => bot._id === id) ?? this.bots.find((bot) => bot._id === id);

          if (!existsInSubscribed && botToAdd) {
            this.subscribedBots = [...this.subscribedBots, botToAdd];
          } else if (existsInSubscribed) {
            this.subscribedBots = updateFollowers(this.subscribedBots);
          }
        } else {
          this.subscribedBots = this.subscribedBots.filter((bot) => bot._id !== id);
        }
      });
      this.notify();
    } catch (e) {
      this.root.uiStore.showSnackbar('Failed to update follow status', 'error');
    }
  }

  async createBot(formData: FormData) {
    try {
      const { data } = await this.profileService.createAiBot(formData);
      runInAction(() => {
        this.myBots.push(data);
        this.notify();
      });
      this.root.uiStore.showSnackbar("Created", "success");
      return data;
    } catch (error: unknown) {
      this.root.uiStore.showSnackbar("Failed", "error");
      throw error;
    }
  }

  private buildCreationFormData() {
    const formData = new FormData();
    formData.append('name', this.form.firstName.trim());
    formData.append('lastname', this.form.lastName.trim());
    formData.append('userBio', this.form.description.trim());
    formData.append('aiPrompt', this.form.prompt.trim());
    const intro = this.form.intro.trim();
    if (intro) {
      formData.append('intro', intro);
      formData.append('introMessage', intro);
    }
    if (this.form.categories.length) {
      formData.append('categories', JSON.stringify(this.form.categories));
    }
    if (this.form.usefulness.length) {
      formData.append('usefulness', JSON.stringify(this.form.usefulness));
    }
    if (this.avatar) {
      formData.append('avatar', this.avatar);
    }
    return formData;
  }

  private buildGalleryFormData() {
    if (!this.gallery.length) {
      return null;
    }

    const formData = new FormData();
    this.gallery.forEach((item) => {
      formData.append('photos', item.file, item.file.name);
    });
    return formData;
  }

  async submitCreation() {
    if (this.isSubmitting || this.completed) {
      return;
    }

    this.isSubmitting = true;
    this.creationError = null;
    this.notify();

    try {
      const payload = this.buildCreationFormData();
      const created = await this.createBot(payload);

      if (!created) {
        throw new Error('Failed to create AI agent');
      }

      const galleryPayload = this.buildGalleryFormData();
      if (galleryPayload) {
        await this.addBotPhotos(created._id, galleryPayload);
      }

      runInAction(() => {
        this.completed = true;
        this.createdBot = created;
      });
      this.notify();

      this.root.uiStore.showSnackbar('AI agent created', 'success');
    } catch (error: unknown) {
      const message = this.resolveErrorMessage(error);

      runInAction(() => {
        this.creationError = message;
      });
      this.notify();

      this.root.uiStore.showSnackbar('Failed to create AI agent', 'error');
    } finally {
      runInAction(() => {
        this.isSubmitting = false;
      });
      this.notify();
    }
  }

  private resolveErrorMessage(error: unknown) {
    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object') {
      const maybeResponse = (error as any).response;
      const responseMessage = maybeResponse?.data?.message;
      if (typeof responseMessage === 'string') {
        return responseMessage;
      }

      if (Array.isArray(responseMessage) && responseMessage.length) {
        return String(responseMessage[0]);
      }

      if ('message' in error && typeof (error as any).message === 'string') {
        return (error as any).message;
      }
    }

    return 'Failed to create AI agent';
  }

  async updateBot(id: string, payload: AiBotUpdatePayload, avatar?: AvatarFile | File) {
    try {
      let updated: UserDTO | undefined;

      if (Object.keys(payload).length) {
        const res = await this.profileService.updateAiBot(id, payload);
        updated = res.data;
      }

      if (avatar) {
        const formData = new FormData();
        formData.append("avatar", avatar as any);
        const res = await this.profileService.uploadAiBotAvatar(id, formData);
        updated = res.data;
      }

      if (updated) {
        const additionalFields: Partial<AiBotDTO> = {};
        if (payload.aiPrompt !== undefined) {
          additionalFields.aiPrompt = payload.aiPrompt;
        }
        if (payload.intro !== undefined) {
          additionalFields.intro = payload.intro;
        }
        if (payload.categories !== undefined) {
          additionalFields.categories = payload.categories;
        }
        if (payload.usefulness !== undefined) {
          additionalFields.usefulness = payload.usefulness;
        }

        runInAction(() => {
          const applyUserUpdate = <T extends UserDTO>(collection: T[]) =>
            collection.map((bot) => (bot._id === id ? ({ ...bot, ...updated } as T) : bot));
          const applyAiBotUpdate = (collection: AiBotDTO[]) =>
            collection.map((bot) => (bot._id === id ? ({ ...bot, ...updated, ...additionalFields }) : bot));

          this.myBots = applyUserUpdate(this.myBots);
          this.userAiBots = applyAiBotUpdate(this.userAiBots);
          this.bots = applyUserUpdate(this.bots);

          if (this.selectAiBot && this.selectAiBot._id === id) {
            this.selectAiBot = { ...this.selectAiBot, ...updated, ...additionalFields };
          }

          if (this.createdBot && this.createdBot._id === id) {
            this.createdBot = { ...this.createdBot, ...updated };
          }

          if (this.botDetails && this.selectAiBot && this.selectAiBot._id === id) {
            this.botDetails = {
              ...this.botDetails,
              ...(payload.aiPrompt !== undefined ? { aiPrompt: payload.aiPrompt } : {}),
              ...(payload.intro !== undefined ? { intro: payload.intro } : {}),
              ...(payload.categories !== undefined ? { categories: payload.categories } : {}),
              ...(payload.usefulness !== undefined ? { usefulness: payload.usefulness } : {}),
            };
          }

          this.notify();
        });

        this.root.uiStore.showSnackbar('AI agent updated', 'success');
      }

      return updated as AiBotDTO | undefined;
    } catch (e) {
      this.root.uiStore.showSnackbar('Failed to update AI agent', 'error');
      throw e;
    }
  }

  async deleteBot(id: string) {
    try {
      await this.profileService.deleteAiBot(id);
      runInAction(() => {
        this.myBots = this.myBots.filter((bot) => bot._id !== id);
        this.userAiBots = this.userAiBots.filter((bot) => bot._id !== id);
        this.bots = this.bots.filter((bot) => bot._id !== id);
        if (this.selectAiBot?._id === id) {
          this.selectAiBot = null;
        }
        if (this.createdBot?._id === id) {
          this.createdBot = null;
        }
        this.botDetails = null;
        this.botPhotos = [];
        this.notify();
        this.root.uiStore.showSnackbar('AI agent deleted', 'success');
      });
    } catch (e) {
      throw e;
    }
  }

  getBot(id: string) {
    return this.myBots.find(b => b._id === id);
  }

  async fetchBotDetails(id: string) {
    this.photosLoading = true;
    this.notify();
    try {
      const { data } = await this.profileService.getAiBotDetails(id);
      runInAction(() => {
        this.botPhotos = data.photos ?? [];
        this.botDetails = data;
      });
      this.notify();
    } catch (e) {
      this.root.uiStore.showSnackbar("Failed", "error");
    } finally {
      runInAction(() => {
        this.photosLoading = false;
      });
      this.notify();
    }
  }

  async addBotPhotos(id: string, formData: FormData) {
    this.photosUpdating = true;
    this.notify();
    try {
      const { data } = await this.profileService.addAiBotPhotos(id, formData);
      runInAction(() => {
        this.botPhotos = data.photos ?? [];
      });
      this.notify();
      this.root.uiStore.showSnackbar("Saved", "success");
    } catch (e) {
      this.root.uiStore.showSnackbar("Upload failed", "error");
    } finally {
      runInAction(() => {
        this.photosUpdating = false;
      });
      this.notify();
    }
  }

  async deleteBotPhotos(id: string, photoUrls: string[]) {
    if (!photoUrls.length) return;
    this.photosUpdating = true;
    this.notify();
    try {
      const { data } = await this.profileService.deleteAiBotPhotos(id, photoUrls);
      runInAction(() => {
        this.botPhotos = data.photos ?? [];
      });
      this.notify();
      this.root.uiStore.showSnackbar("Deleted", "success");
    } catch (e) {
      this.root.uiStore.showSnackbar("Delete failed", "error");
    } finally {
      runInAction(() => {
        this.photosUpdating = false;
      });
      this.notify();
    }
  }

  clearBotDetails() {
    this.botPhotos = [];
    this.botDetails = null;
    this.notify();
  }
}
