import { makeAutoObservable, runInAction } from 'mobx';
import { BaseStore } from './BaseStore';
import type { RootStore } from './RootStore';
import { MAX_GALLERY_ITEMS, steps } from '@/helpers/data/agent-create';
import type { FormState, GalleryItem } from '@/helpers/types/agent-create';
import { revokeGallery, revokeIfNeeded } from '@/helpers/utils/agent-create';
import { highlights as defaultHighlights, openings as defaultOpenings } from '@/helpers/data/ai-agent';
import { AiBotDTO } from '@/helpers/types/dtos/AiBotDto';
import { UserDTO } from '@/helpers/types';
import { AvatarFile, ProfilesFilterParams } from '@/helpers/types/profile';
import ProfileService, { AiBotUpdatePayload } from "@/services/profile/ProfileService";

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
  };
  avatar: File | null = null;
  avatarPreview: string | null = null;
  gallery: GalleryItem[] = [];
  completed = false;
  readonly maxGalleryItems = MAX_GALLERY_ITEMS;

  private profileService = ProfileService;

  createdBot: UserDTO | null = null;
  isSubmitting = false;
  creationError: string | null = null;

  selectAiBot: AiBotDTO | null = null;
  userAiBots: AiBotDTO[] = [];
  botPhotos: string[] = [];

  myBots: UserDTO[] = [];
  subscribedBots: UserDTO[] = [];
  photosLoading = false;
  photosUpdating = false;
  isAiUserLoading = false;

  bots: UserDTO[] = [];
  isLoadingAiProfiles = false;
  hasMoreAiProfiles = false;

  header: AiAgentHeader = {
    name: 'aiAgent α',
    curatorLabel: 'Curated Intelligence',
    tagline: 'Designed for deep, real-time co-thinking.',
    avatarSrc: '/img/mizuhara.png',
  };
  statsChips = ['1.4K followers', '210 chats today', 'By @talkie-labs'];
  introduction =
    "You just met aiAgent α for the first time in the backroom of your own thoughts. The partnership is the safety net beneath your daily leaps—an undercover intelligence ally primed to steady you before the next wave arrives.";
  signatureMoves = [
    'Detects emotional drift and reorients the conversation with grounding prompts.',
    'Threads long-form context into crisp strategies without losing warmth.',
    'Mirrors your language patterns to reduce friction and build momentum.',
  ];
  highlights = [...defaultHighlights];
  openings = [...defaultOpenings];

  constructor(root: RootStore) {
    super();
    this.root = root;
    makeAutoObservable(this);
  }

  get steps() {
    return steps;
  }

  get currentStepComplete(): boolean {
    if (this.step === 0) {
      return Boolean(
        this.form.firstName.trim() &&
        this.form.lastName.trim() &&
        (this.avatar !== null || this.avatarPreview !== null),
      );
    }
    if (this.step === 1) {
      return Boolean(
        this.form.prompt.trim() &&
        this.form.description.trim() &&
        this.form.intro.trim(),
      );
    }
    return this.gallery.length > 0;
  }

  setStep(step: number) {
    if (step === this.step) return;
    this.step = step;
    this.completed = false;
    this.creationError = null;
    this.notify();
  }

  setFormField(field: keyof FormState, value: string) {
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
    this.form = { firstName: '', lastName: '', prompt: '', description: '', intro: '' };
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
      // UiStore.showSnackbar("Failed", "error");
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
      // uiStore.showSnackbar("Failed", "error");
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
      // uiStore.showSnackbar("Failed", "error");
    }
  }

  async createBot(formData: FormData) {
    try {
      const { data } = await this.profileService.createAiBot(formData);
      runInAction(() => {
        this.myBots.push(data);
        this.notify();
      });
      // uiStore.showSnackbar("Created", "success");
      return data;
    } catch (error: unknown) {
      // uiStore.showSnackbar("Failed", "error");
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

  async updateBot(id: string, data: AiBotUpdatePayload, avatar?: AvatarFile | File) {
    try {
      let updated: UserDTO | undefined;

      if (Object.keys(data).length) {
        const res = await this.profileService.updateAiBot(id, data);
        updated = res.data;
      }

      if (avatar) {
        const formData = new FormData();
        formData.append("avatar", avatar as any);
        const res = await this.profileService.uploadAiBotAvatar(id, formData);
        updated = res.data;
      }

      if (updated) {
        runInAction(() => {
          const applyUpdate = <T extends UserDTO>(collection: T[]) =>
            collection.map((bot) => (bot._id === id ? ({ ...bot, ...updated } as T) : bot));

          this.myBots = applyUpdate(this.myBots);
          this.userAiBots = applyUpdate(this.userAiBots);
          this.bots = applyUpdate(this.bots);

          if (this.selectAiBot && this.selectAiBot._id === id) {
            this.selectAiBot = { ...this.selectAiBot, ...updated };
          }

          if (this.createdBot && this.createdBot._id === id) {
            this.createdBot = { ...this.createdBot, ...updated };
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
        this.myBots = this.myBots.filter(b => b._id !== id);
        this.notify();
      });
      // uiStore.showSnackbar("Deleted", "success");
    } catch (e) {
      // uiStore.showSnackbar("Failed", "error");
    }
  }

  getBot(id: string) {
    return this.myBots.find(b => b._id === id);
  }

  async fetchBotPhotos(id: string) {
    this.photosLoading = true;
    this.notify();
    try {
      const { data } = await this.profileService.getAiBotPhotos(id);
      runInAction(() => {
        this.botPhotos = data.photos ?? [];
      });
      this.notify();
    } catch (e) {
      // uiStore.showSnackbar("Failed", "error");
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
      // uiStore.showSnackbar("Saved", "success");
    } catch (e) {
      // uiStore.showSnackbar("Upload failed", "error");
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
      // uiStore.showSnackbar("Deleted", "success");
    } catch (e) {
      // uiStore.showSnackbar("Delete failed", "error");
    } finally {
      runInAction(() => {
        this.photosUpdating = false;
      });
      this.notify();
    }
  }

  clearBotPhotos() {
    this.botPhotos = [];
    this.notify();
  }
}
