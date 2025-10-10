import { AxiosResponse } from "axios";

import $api from "@/helpers/http";
import { AiBotDetails, AiBotDTO, AiBotMainPageBot, ProfileDTO, UserDTO } from "@/helpers/types";
import { getQueriedUrl } from "@/helpers/queryStringHelper";
import { ProfilesFilterParams } from "@/helpers/types/profile";
import { StringifiableRecord } from "query-string";


export interface AiBotUpdatePayload {
  name?: string;
  lastname?: string;
  profession?: string;
  userBio?: string;
  aiPrompt?: string;
  intro?: string;
  introMessage?: string;
  categories?: string[];
  usefulness?: string[];
}

export interface AiBotPhotoResponse extends AiBotDetails {
  id?: string;
  botId: string;
  photos: string[];
  createdAt?: string;
  updatedAt?: string;
  isFollowing: boolean;
}


class AiBotDetailsService {
  /**
   * Получить список созданных AI-ботов.
   */

  public async getAllAiBots(params: ProfilesFilterParams = {}): Promise<AxiosResponse<{ profiles: ProfileDTO[], hasMore: boolean }>> {
    return $api.get(getQueriedUrl({ url: "/profile/ai-bots/all", query: params as StringifiableRecord }));
  }

  public async getAiBotById(botId: string): Promise<AxiosResponse<AiBotDTO>> {
    return $api.get(`/profile/ai-bots/${botId}`);
  }

  public async getAiBotsByCreator(creatorId: string): Promise<AxiosResponse<AiBotDTO[]>> {
    return $api.get(`/profile/ai-bots/created-by/${creatorId}`);
  }


  /**
   * Получить список созданных AI-ботов текущего пользователя.
   */
  public async getMyAiBots(): Promise<AxiosResponse<UserDTO[]>> {
    return $api.get(`/profile/ai-bots/my`);
  }

  /**
   * Получить список AI-ботов, на которых подписан текущий пользователь.
   */
  public async getSubscribedAiBots(): Promise<AxiosResponse<UserDTO[]>> {
    return $api.get(`/profile/ai-bots/subscribed`);
  }

  /**
   * Подписаться или отписаться от AI-бота по его идентификатору.
   */
  public async followAiBotById(id: string): Promise<AxiosResponse<{ followers: number; isFollowing: boolean }>> {
    return $api.put(`/profile/${id}/follow`);
  }

  /**
   * Создать нового AI-бота. Для передачи аватара необходимо использовать FormData.
   */
  public async createAiBot(formData: FormData): Promise<AxiosResponse<UserDTO>> {
    return $api.post(`/profile/ai-bots`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  /**
   * Обновить данные AI-бота (без загрузки аватара).
   */
  public async updateAiBot(id: string, data: AiBotUpdatePayload): Promise<AxiosResponse<UserDTO>> {
    return $api.patch(`/profile/ai-bots/${id}`, data);
  }

  /**
   * Загрузить аватар для AI-бота.
   */
  public async uploadAiBotAvatar(id: string, formData: FormData): Promise<AxiosResponse<UserDTO>> {
    return $api.post(`/profile/ai-bots/${id}/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  /**
   * Получить фотографии для AI-бота.
   */
  public async getAiBotDetails(id: string): Promise<AxiosResponse<AiBotPhotoResponse>> {
    return $api.get(`/profile/ai-bots/${id}/details`);
  }

  /**
   * Загрузить новые фотографии для AI-бота.
   */
  public async addAiBotPhotos(id: string, formData: FormData): Promise<AxiosResponse<AiBotPhotoResponse>> {
    return $api.post(`/profile/ai-bots/${id}/photos`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  /**
   * Удалить фотографии AI-бота по ссылкам.
   */
  public async deleteAiBotPhotos(id: string, photoUrls: string[]): Promise<AxiosResponse<AiBotPhotoResponse>> {
    return $api.delete(`/profile/ai-bots/${id}/photos`, {
      data: { photoUrls },
    });
  }

  /**
   * Удалить AI-бота по идентификатору.
   */
  public async deleteAiBot(id: string): Promise<AxiosResponse<void>> {
    return $api.delete(`/profile/ai-bots/${id}`);
  }

  public async fetchAiBotsForMainPage(): Promise<AxiosResponse<AiBotMainPageBot[]>> {
    return $api.get("/profile/ai-bots/fetchAiBotsForMainPage");
  }
}

const aiBotDetailsService = new AiBotDetailsService();

export default aiBotDetailsService;
