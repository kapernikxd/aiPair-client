import { makeAutoObservable, runInAction } from 'mobx';
import { BaseStore } from './BaseStore';
import type { RootStore } from './RootStore';
import type { ProfilesFilterParams, AiAgentCard, UpdateProfileProps } from '@/helpers/types/profile';
import { MyProfileDTO, ProfileDTO, UserDTO } from '@/helpers/types';
import ProfileService, { UsersFilterParams } from '@/services/profile/ProfileService';
import { ChangePasswordProps } from '@/services/auth/AuthResponse';

import {
  badges as profileBadges,
  talkies as profileTalkies,
  milestones,
  initialProfile,
  genderLabels,
  genderOptions as defaultGenderOptions,
  relationshipOptions as defaultRelationshipOptions,
} from '@/helpers/data/profile';
import { badges as userBadges, talkies as userTalkies } from '@/helpers/data/user';
import type { EditableProfile } from '@/helpers/types/profile';


export type PublicProfile = {
  name: string;
  intro: string;
  location: string;
  avatar: string;
  badges: string[];
  talkies: AiAgentCard[];
};

export class ProfileStore extends BaseStore {
  private root: RootStore;
  /** Профиль текущего пользователя */
  myProfile: MyProfileDTO = {} as MyProfileDTO;
  /** Просматриваемый профиль (например, другого пользователя) */
  profile: ProfileDTO = {} as ProfileDTO;
  isLoadingProfile: boolean = false;
  /** Список всех профилей */
  profiles: ProfileDTO[] = [];
  hasMoreProfiles: boolean = true;
  isLoadingProfiles: boolean = false;
  /** Список подписчиков */
  followers: UserDTO[] = [];
  /** Список подписок (на кого подписан пользователь) */
  following: UserDTO[] = [];
  followersHasMore = true;
  followingHasMore = true;
  isLoadingFollowers = false;
  isLoadingFollowing = false;

  /** Инстанс сервиса для работы с API профиля */
  private profileService = ProfileService;

  badges = [...profileBadges];
  talkies = [...profileTalkies];
  milestones = [...milestones];
  genderLabels = { ...genderLabels };
  genderOptions = [...defaultGenderOptions];
  relationshipOptions = [...defaultRelationshipOptions];

  userProfile: PublicProfile = {
    name: 'Keyser Soze',
    intro: "One of my favorite movies is the “Usual Suspects” (1995) from where I picked up the name Keyser Soze.",
    location: 'Somewhere in the shadows',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80',
    badges: [...userBadges],
    talkies: [...userTalkies],
  };


  constructor(root: RootStore) {
    super();
    this.root = root;
    makeAutoObservable(this);
  }

  get genderLabel() {
    return;
  }

  get getProfileInitial() {
    return this.userProfile;
  }

  /**
     * Очищает данные профилей.
     */
  clearProfileData = () => {
    this.myProfile = {} as MyProfileDTO;
    this.profile = {} as ProfileDTO;
    this.followers = [];
    this.following = [];
    this.followersHasMore = true;
    this.followingHasMore = true;
    this.notify();
  };

  resetFollowing = () => {
    this.following = [];
    this.followingHasMore = true;
    this.notify();
  };

  resetFollowers = () => {
    this.followers = [];
    this.followersHasMore = true;
    this.notify();
  };

  /**
   * Возвращает информацию профиля текущего пользователя.
   */
  getMyProfileInfo = () => this.myProfile;

  /**
   * Получает профиль текущего пользователя.
   */
  async fetchMyProfile() {
    try {
      const { data } = await this.profileService.getMyProfile();
      runInAction(() => {
        this.myProfile = data;
      });
      this.notify();
      return data;
    } catch (error) {
      console.error("Error fetching my profile", error);
    }
  }

  /**
   * Получает профиль по его идентификатору.
   * @param id Идентификатор профиля
   */
  async fetchProfileById(id: string) {
    this.isLoadingProfile = true;
    this.notify();

    try {
      const { data } = await this.profileService.getProfileById(id);
      runInAction(() => {
        this.profile = data;
        this.isLoadingProfile = false;
      });
      this.notify();
      return data;
    } catch (error) {
      runInAction(() => {
        this.isLoadingProfile = false;
      });
      this.notify();
      console.error("Error fetching profile by id", error);
    }
  }

  clearViewedProfile = () => {
    this.profile = {} as ProfileDTO;
    this.isLoadingProfile = false;
    this.notify();
  };

  /**
   * Получает список всех профилей.
   */
  async fetchProfiles(params: ProfilesFilterParams) {
    if (this.isLoadingProfiles || (!this.hasMoreProfiles && params?.page && params.page > 1)) return;

    this.isLoadingProfiles = true;
    try {
      const { data } = await this.profileService.getProfiles(params);
      runInAction(() => {
        // Если это первая страница — заменяем события
        if (params?.page === 1) {
          this.profiles = data.profiles;
          // Если загружаем следующую страницу — добавляем к существующим
        } else {
          this.profiles = [...this.profiles, ...data.profiles];
        }
        this.hasMoreProfiles = data.hasMore; // Флаг, есть ли еще данные
        // this.profiles = data;
      });
    } catch (error) {
      console.error("Error fetching profiles", error);
    } finally {
      runInAction(() => {
        this.isLoadingProfiles = false;
      });
    }
  }

  /**
   * Загружает фотографию профиля.
   * @param fileData Данные файла в формате FormData
   */
  async uploadProfilePhoto(fileData: FormData) {
    try {
      await this.profileService.uploadProfilePhoto(fileData);
    } catch (error) {
      console.error("Error uploading profile photo", error);
    }
  }

  /**
   * Получает фотографию профиля.
   */
  async fetchProfilePhoto() {
    try {
      await this.profileService.getProfilePhoto();
    } catch (error) {
      console.error("Error fetching profile photo", error);
    }
  }

  /**
   * Удаляет фотографию профиля.
   * @param fileName Имя файла фотографии
   */
  async deleteProfilePhoto(fileName: string) {
    try {
      await this.profileService.deleteProfilePhoto({ name: fileName });
    } catch (error) {
      console.error("Error deleting profile photo", error);
    }
  }

  /**
   * Обновляет данные профиля текущего пользователя.
   * @param props Данные для обновления профиля
   */
  async updateProfile(props: UpdateProfileProps) {
    try {
      const { data } = await this.profileService.updateProfile(props);
      runInAction(() => {
        Object.assign(this.myProfile, data.user);
      });
      this.notify();
    } catch (error) {
      console.error("Error updating profile", error);
    }
  }

  /**
   * Изменяет пароль пользователя.
   * @param props Объект с полями oldPassword и password
   */
  async changePassword(props: ChangePasswordProps) {
    try {
      const { data } = await this.profileService.changePassword(props);
      return data;
    } catch (error: any) {
      // Преобразуем ошибки в формат, подходящий для react-hook-form
      if (error.response?.data?.errors) {
        const formattedErrors = error.response.data.errors.reduce(
          (acc: Record<string, string>, errorItem: { field: string; message: string }) => {
            acc[errorItem.field] = errorItem.message;
            return acc;
          },
          {}
        );
        throw formattedErrors;
      }
      throw error;
    }
  }

  /**
   * Подписывается или отписывается от профиля по его идентификатору.
   * @param id Идентификатор профиля для подписки/отписки
   */
  async followProfile(id: string) {
    try {
      const { data } = await this.profileService.followProfileById(id);
      runInAction(() => {
        // Обновляем данные просматриваемого профиля
        this.profile.followers = data.followers;
        this.profile.isFollowing = data.isFollowing;
        // Если нужно, обновляем и счётчик подписок у моего профиля (при условии, что он числовой)
        if (typeof this.myProfile.following === "number") {
          this.myProfile.following = data.isFollowing
            ? this.myProfile.following + 1
            : this.myProfile.following - 1;
        }
      });
      this.notify();
    } catch (error) {
      // uiStore.showSnackbar("Failed", "error");
    }
  }

  /**
   * Получает список подписчиков текущего пользователя.
   */
  async fetchMyFollowers(params: UsersFilterParams) {
    if (this.isLoadingFollowers || (!this.followersHasMore && params.page && params.page > 1)) return;

    runInAction(() => {
      this.isLoadingFollowers = true;
    });
    this.notify();
    try {
      const { data } = await this.profileService.getMyFollowers(params);
      runInAction(() => {
        if (params.page && params.page > 1) {
          this.followers = [...this.followers, ...data.users];
        } else {
          this.followers = data.users;
        }
        this.followersHasMore = data.hasMore;
      });
      this.notify();
    } catch (error) {
      console.error("Error fetching my followers", error);
    } finally {
      runInAction(() => {
        this.isLoadingFollowers = false;
      });
      this.notify();
    }
  }

  /**
   * Получает список подписок (на кого подписан текущий пользователь).
   */
  async fetchMyFollowing(params: UsersFilterParams) {
    if (this.isLoadingFollowing || (!this.followingHasMore && params.page && params.page > 1)) return;

    runInAction(() => {
      this.isLoadingFollowing = true;
    });
    this.notify();
    try {
      const { data } = await this.profileService.getMyFollowing(params);
      runInAction(() => {
        if (params.page && params.page > 1) {
          this.following = [...this.following, ...data.users];
        } else {
          this.following = data.users;
        }
        this.followingHasMore = data.hasMore;
      });
      this.notify();
    } catch (error) {
      console.error("Error fetching my following", error);
    } finally {
      runInAction(() => {
        this.isLoadingFollowing = false;
      });
      this.notify();
    }
  }

  /**
   * Получает список подписчиков указанного профиля.
   * @param userId Идентификатор профиля
   */
  async fetchFollowers(userId: string, params: UsersFilterParams) {
    if (this.isLoadingFollowers || (!this.followersHasMore && params.page && params.page > 1)) return;

    runInAction(() => {
      this.isLoadingFollowers = true;
    });
    this.notify();
    try {
      const { data } = await this.profileService.getFollowersById(userId, params);
      runInAction(() => {
        if (params.page && params.page > 1) {
          this.followers = [...this.followers, ...data.users];
        } else {
          this.followers = data.users;
        }
        this.followersHasMore = data.hasMore;
      });
      this.notify();
    } catch (error) {
      console.error("Error fetching followers", error);
    } finally {
      runInAction(() => {
        this.isLoadingFollowers = false;
      });
      this.notify();
    }
  }

  /**
   * Получает список подписок указанного профиля.
   * @param userId Идентификатор профиля
   */
  async fetchFollowing(userId: string, params: UsersFilterParams) {
    if (this.isLoadingFollowing || (!this.followingHasMore && params.page && params.page > 1)) return;

    runInAction(() => {
      this.isLoadingFollowing = true;
    });
    this.notify();
    try {
      const { data } = await this.profileService.getFollowingById(userId, params);
      runInAction(() => {
        if (params.page && params.page > 1) {
          this.following = [...this.following, ...data.users];
        } else {
          this.following = data.users;
        }
        this.followingHasMore = data.hasMore;
      });
      this.notify();
    } catch (error) {
      console.error("Error fetching following", error);
    } finally {
      runInAction(() => {
        this.isLoadingFollowing = false;
      });
      this.notify();
    }
  }

  async blockUser(data: { reason?: string, details?: string, targetId: string }) {
    try {
      await this.profileService.blockUser(data);
    } catch (error) {
      console.error(error);
    }
  }

  async deleteAccount() {
    try {
      await this.profileService.deleteAccount(this.myProfile._id);
    } catch (error) {
      console.error(error);
    }
  }

}
