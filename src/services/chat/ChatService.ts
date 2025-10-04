import { AxiosResponse } from "axios";
import { ChatById, ReadedMessageResponse } from "./ChatResponse";
import $api from "@/helpers/http";
import { ChatDTO, MessageDTO } from "@/helpers/types";

export interface FetchChatsOptions {
  typeChat?: 'private' | 'group' | 'bot';
  limit?: number;
  page?: number;
  search?: string;
}

export interface FetchChatsResponse {
  chats: ChatDTO[];
  hasMore: boolean;
}

export type UnreadStatus = {
  hasUnread: boolean;
  group: boolean;
  private: boolean;
  bot: boolean;
};

export default class ChatService {
  async fetchChats(
    options?: FetchChatsOptions
  ): Promise<AxiosResponse<FetchChatsResponse>> {
    const { typeChat, ...params } = options || {};
    if (typeChat === 'bot') {
      return this.fetchBotChats(params);
    }
    const queryParams = typeChat ? { ...params, typeChat } : params;
    return $api.get("/chat/all", { params: queryParams });
  }

  async fetchBotChats(
    options?: Omit<FetchChatsOptions, 'typeChat'>
  ): Promise<AxiosResponse<FetchChatsResponse>> {
    const params = options || {};
    return $api.get("/chat/bot/all", { params });
  }

  async fetchChatById(id: string): Promise<AxiosResponse<ChatById>> {
    return $api.get(`/chat/${id}`);
  }

  async markChatAsRead(chatId: string, messageId: string): Promise<AxiosResponse<ReadedMessageResponse>> {
    return $api.post(`/chat/${chatId}/read`, { messageId });
  }

  async hasUnreadMessages(): Promise<AxiosResponse<UnreadStatus>> {
    return $api.get(`/chat/has-unread`);
  }

  async fetchChatMessages(id: string, skip: number): Promise<AxiosResponse<{ messages: MessageDTO[] }>> {
    return $api.get(`/messages/${id}/messages?skip=${skip}`);
  }

  async markAllMessagesAsRead(chatId: string): Promise<AxiosResponse<void>> {
    return $api.put(`/messages/${chatId}/messages/markAsRead`);
  }

  async clearChatHistory(chatId: string): Promise<AxiosResponse<void>> {
    return $api.delete(`/messages/${chatId}/messages`);
  }

  async sendMessage(
    message: string,
    chatId: string,
    replyToMessageId?: string,
    images?: UploadImage[]
  ): Promise<AxiosResponse<{ data: MessageDTO }>> {
    const formData = new FormData();
    formData.append('content', message);
    formData.append('chatId', chatId);
    if (replyToMessageId) formData.append('replyTo', replyToMessageId);

    images?.forEach((img, index) => {
      const file: FormDataImage = {
        uri: img.uri,
        name: img.fileName ?? `image_${index}.jpg`,
        type: img.mimeType ?? 'image/jpeg',
      };
      formData.append('images', file as unknown as Blob);
    });

    return $api.post(`/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async editMessage(messageId: string, content: string): Promise<AxiosResponse<{ data: MessageDTO }>> {
    return $api.patch(`/messages/${messageId}`, { content });
  }

  async messageByIdRequest(userId: string): Promise<MessageByIdResponse> {
    return $api.get(`/messages/${userId}`).then((res) => res.data as MessageByIdResponse);
  }

  async fetchLastReadedMessageRequest({ userId, chatId }: { userId: string, chatId: string }): Promise<AxiosResponse<ReadedMessageResponse>> {
    return $api.get(`/messages/lastReadedId/${userId}/${chatId}`);
  }

  async reportMessage(
    messageId: string,
  ): Promise<AxiosResponse<boolean>> {
    return $api.post(`/reports`, { targetType: 'message', targetId: messageId });
  }

  async fetchPinnedMessages(chatId: string): Promise<AxiosResponse<{ data: MessageDTO[] }>> {
    return $api.get(`/messages/${chatId}/pins`);
  }

  async pinMessage(messageId: string): Promise<AxiosResponse<void>> {
    return $api.post(`/messages/${messageId}/pin`);
  }

  async unpinMessage(messageId: string): Promise<AxiosResponse<void>> {
    return $api.delete(`/messages/${messageId}/pin`);
  }
}

export type UploadImage = {
  uri: string;
  fileName?: string;
  mimeType?: string;
};

type FormDataImage = {
  uri: string;
  name: string;
  type: string;
};

export type MessageByIdResponse = {
  _id?: string;
  chat?: { _id?: string } | string;
  data?: { _id?: string; chat?: { _id?: string } | string };
} & Partial<MessageDTO>;
