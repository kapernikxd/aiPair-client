import { makeAutoObservable, runInAction } from 'mobx';
import { BaseStore } from './BaseStore';
import type { RootStore } from './RootStore';
import { ChatDTO, MessageDTO } from '@/helpers/types';
import { ChatById, ReadedMessageResponse } from '@/services/chat/ChatResponse';
import ChatService, { FetchChatsOptions, MessageByIdResponse, UploadImage } from '@/services/chat/ChatService';

import { chatThreads } from '@/helpers/data/chats';
import { initialMessages } from '@/helpers/data/chat';
import type { ChatMessage } from '@/helpers/types/chat';
import type { ChatThread } from '@/helpers/types/chats';


export class ChatStore extends BaseStore {
  threads = [...chatThreads];
  activeThreadId: number | null = this.threads[0]?.id ?? null;
  private messagesByThread = new Map<number, ChatMessage[]>();

  private root: RootStore;

  chats: ChatListItem[] = [];
  selectedChat: ChatById | null = null;
  messages: MessageDTO[] = [];
  pinnedMessages: MessageDTO[] = [];

  lastReadedMessage: ReadedMessageResponse = {} as ReadedMessageResponse;
  opponentId: string | undefined = undefined;

  hasMoreMessages = true;
  hasMoreChats = true;
  isLoadingChats = false;
  isSendingMessage = false;

  isApiCheckedNewMessages = false;

  private currentChatSubscribedId: string | null = null;

  private chatService: ChatService;

  constructor(root: RootStore) {
    super();
    this.root = root;
    makeAutoObservable(this);
    this.chatService = new ChatService();
    if (this.activeThreadId !== null) {
      this.messagesByThread.set(this.activeThreadId, [...initialMessages]);
    }
  }

  get activeMessages(): ChatMessage[] {
    if (this.activeThreadId === null) return [];
    return this.messagesByThread.get(this.activeThreadId) ?? [];
  }

  get activeThread(): ChatThread | null {
    if (this.activeThreadId === null) return null;
    return this.threads.find((thread) => thread.id === this.activeThreadId) ?? null;
  }

  setActiveThread(id: number) {
    this.activeThreadId = id;
    if (!this.messagesByThread.has(id)) {
      this.messagesByThread.set(id, [...initialMessages]);
    }
    this.notify();
  }

  receiveMessage(message: ChatMessage, threadId?: number) {
    const targetThread = threadId ?? this.activeThreadId;
    if (targetThread === null) return;
    const messages = this.messagesByThread.get(targetThread) ?? [];
    this.messagesByThread.set(targetThread, [...messages, message]);
    this.notify();
  }

  resetThread(threadId: number) {
    this.messagesByThread.set(threadId, [...initialMessages]);
    this.notify();
  }

  async loadPinnedMessages(chatId: string) {
    try {
      const { data } = await this.chatService.fetchPinnedMessages(chatId);
      runInAction(() => {
        this.pinnedMessages = data.data || [];
      });
      this.notify();
    } catch (e) {
      console.error("Error loading pinned messages:", e);
    }
  }

  clearPinnedMessages() {
    runInAction(() => {
      this.pinnedMessages = [];
    });
    this.notify();
  }

  isMessagePinned(id: string) {
    return this.pinnedMessages?.some((m) => m._id === id);
  }

  async pinMessage(message: MessageDTO) {
    if (this.isMessagePinned(message._id)) return;
    // if (this.pinnedMessages.length >= 5) {
    //   this.root.uiStore.showSnackbar(
    //     'You can pin up to 5 messages. To pin a new message, remove one of the messages that are already pinned.',
    //     'info'
    //   );
    //   return;
    // }

    try {
      await this.chatService.pinMessage(message._id);
      runInAction(() => {
        this.pinnedMessages.push(message);
      });
      this.notify();
    } catch (e) {
      console.error("Error pinning message:", e);
    }
  }

  async unpinMessage(messageId: string) {
    try {
      await this.chatService.unpinMessage(messageId);
      runInAction(() => {
        this.pinnedMessages = this.pinnedMessages.filter((m) => m._id !== messageId);
      });
      this.notify();
    } catch (e) {
      console.error("Error unpinning message:", e);
    }
  }

  updatePinnedFromMessages() {
    runInAction(() => {
      this.pinnedMessages = this.pinnedMessages
        .filter((pm) => this.messages.find((m) => m._id === pm._id))
        .map((pm) => this.messages.find((m) => m._id === pm._id) || pm);
    });
    this.notify();
  }

  cleanMessages() {
    this.messages = [];
    this.notify();
  }

  async clearChatHistory(chatId: string) {
    try {
      await this.chatService.clearChatHistory(chatId);
      runInAction(() => {
        this.messages = [];
        this.pinnedMessages = [];
        this.hasMoreMessages = false;
      });
      this.notify();
    } catch (err) {
      console.error("Ошибка при очистке истории чата:", err);
      throw err;
    }
  }

  cleanOpponentId() {
    this.opponentId = undefined;
    this.notify();
  }

  get isGroupChat() {
    return this.selectedChat?.isGroupChat || false
  }

  get privateChats() {
    return this.chats.filter((chat) => !chat.isGroupChat && !chat.isBotChat);
  }

  get groupChats() {
    return this.chats.filter((chat) => chat.isGroupChat && Boolean(chat.post?.title));
  }

  get botChats() {
    return this.chats.filter((chat) => chat.isBotChat);
  }

  // 📌 Обновление чатов
  async refreshChats(options?: FetchChatsOptions) {
    const chatIds = await this.fetchChats({ ...options, page: 1 });
    return chatIds
  }

  async fetchChats(options?: FetchChatsOptions) {
    if (this.isLoadingChats || (!this.hasMoreChats && options?.page && options.page > 1)) return [];

    this.isLoadingChats = true;
    this.notify();
    try {
      const response = await this.chatService.fetchChats(options);

      const incomingChats = response.data.chats as ChatListItem[];
      const chatIds = incomingChats.map((chat) => chat._id);

      runInAction(() => {

        if (options?.page && options.page > 1) {
          const chatMap = new Map(this.chats.map((chat) => [chat._id, chat]));

          incomingChats.forEach((chat) => {
            chatMap.set(chat._id, chat);
          });

          this.chats = Array.from(chatMap.values());
        } else {
          const chatMap = new Map<string, ChatListItem>();

          incomingChats.forEach((chat) => {
            if (!chatMap.has(chat._id)) {
              chatMap.set(chat._id, chat);
            }
          });

          this.chats = Array.from(chatMap.values());
        }
        this.hasMoreChats = response.data.hasMore;
      });
      this.notify();
      if (chatIds.length) {
        void this.root.onlineStore.ensureConnectedAndJoined(chatIds);
      }
      return chatIds;
    } catch (err) {
      console.error("Ошибка при получении чатов:", err);
      return []
    } finally {
      runInAction(() => {
        this.isLoadingChats = false;
      });
      this.notify();
    }
  }

  async fetchChat(chatId: string, myId: string) {
    try {
      const response = await this.chatService.fetchChatById(chatId);
      runInAction(() => {
        this.selectedChat = response.data;
        if (!response.data.isGroupChat) {
          if (myId) {
            this.opponentId = response.data?.users?.find(user => user._id !== myId)?._id;
          }
        } else {
          this.opponentId = undefined
        }
      });
      this.notify();
      if (chatId) {
        void this.root.onlineStore.ensureConnectedAndJoined([chatId]);
      }
    } catch (err) {
      console.error("Ошибка при получении чата:", err);
    }
  }

  async hasUnreadMessages() {
    if (this.isApiCheckedNewMessages) return;
    try {
      const { data } = await this.chatService.hasUnreadMessages();
      this.root.onlineStore.setUnreadStatus(data);
    } catch (err) {
      console.error("Ошибка при получени непрочитанных:", err);
    } finally {
      runInAction(() => {
        this.isApiCheckedNewMessages = true;
      })
    };
  }

  async fetchChatMessages(chatId: string, skip: number = 0) {
    try {
      const response = await this.chatService.fetchChatMessages(chatId, skip);
      const incomingMessages: MessageDTO[] = response.data.messages;

      runInAction(() => {
        const currentIds = new Set(this.messages.map((msg) => msg._id));

        const uniqueMessages = incomingMessages.filter((msg) => !currentIds.has(msg._id));

        if (skip === 0) {
          this.messages = incomingMessages;
        } else {
          this.messages = [...uniqueMessages, ...this.messages]; // ✅ Добавляем старые в начало
        }

        this.hasMoreMessages = incomingMessages.length === 30; // ✅ Если меньше 30, значит, больше нет
        this.updatePinnedFromMessages();
      });
      this.notify();
    } catch (err) {
      console.error("Ошибка при получении сообщений:", err);
    }
  }

  setMessages(newMessages: MessageDTO[]) {
    runInAction(() => {
      this.messages = newMessages;
    });
    this.notify();
  }

  async sendMessage(
    message: string,
    chatId: string,
    replyToMessageId?: string,
    images?: UploadImage[],
  ) {
    try {
      runInAction(() => {
        this.isSendingMessage = true;
      });
      const { data } = await this.chatService.sendMessage(
        message,
        chatId,
        replyToMessageId,
        images
      );

      const messageData: MessageDTO = {
        ...data.data,
        readBy: data.data.readBy ?? [],
        isEdited: data.data.isEdited ?? false,
      };

      runInAction(() => {
        const exists = this.messages.some((message) => message._id === messageData._id);
        if (!exists) {
          this.messages = [...this.messages, messageData];
        }
      });
      this.notify();
    } catch (err) {
      this.root.uiStore.showSnackbar("Failed", "error");
      console.error("Ошибка при отправке сообщения:", err);
    } finally {
      runInAction(() => {
        this.isSendingMessage = false;
      });
      this.notify();
    }
  }

  async editMessage(messageId: string, content: string) {
    try {
      const { data } = await this.chatService.editMessage(messageId, content);
      this.root.onlineStore.emitEditedMessage(data.data)

      runInAction(() => {
        const index = this.messages.findIndex((msg) => msg._id === messageId);
        if (index !== -1) {
          this.messages[index].content = content;
          this.messages[index].isEdited = true;
        }
      });
    } catch (err) {
      console.error("Ошибка при редактировании сообщения:", err);
    }
  }

  subscribeToChats() {
    if (!this.root.onlineStore.socket) return;
    console.log("📲 Подписываюсь на список чатов...");
    // важно: снять старый хендлер перед повторной подпиской
    this.root.onlineStore.socket.off('newMessageFromChats', this.handleNewMessageFromChats);
    this.root.onlineStore.socket.on('newMessageFromChats', this.handleNewMessageFromChats);
  }

  unsubscribeFromChats() {
    if (!this.root.onlineStore.socket) return;
    console.log("🚪 Отписываюсь от списка чатов...");
    this.root.onlineStore.socket.off('newMessageFromChats', this.handleNewMessageFromChats);
  }

  subscribeToChat(chatId: string) {
    if (!this.root.onlineStore.socket) return;

    // если уже подписаны на этот же чат — ничего не делаем
    if (this.currentChatSubscribedId === chatId) return;

    // перед подпиской снимаем ВСЕ связанные хендлеры (на случай переезда между чатами)
    this.root.onlineStore.socket.off("typing", this.root.onlineStore.handleTyping);
    this.root.onlineStore.socket.off("stop typing", this.root.onlineStore.handleStopTyping);
    this.root.onlineStore.socket.off('server-message:new', this.handleNewMessage);
    this.root.onlineStore.socket.off('editedMessage', this.handleEditedMessage);
    this.root.onlineStore.socket.off('server-message:read', this.handleMarkAsRead);

    this.root.onlineStore.clearTypingUsers();
    this.root.onlineStore.socket.on("typing", this.root.onlineStore.handleTyping);
    this.root.onlineStore.socket.on("stop typing", this.root.onlineStore.handleStopTyping);
    this.root.onlineStore.socket.on('server-message:new', this.handleNewMessage);
    this.root.onlineStore.socket.on('editedMessage', this.handleEditedMessage);
    this.root.onlineStore.socket.on('server-message:read', this.handleMarkAsRead);

    this.currentChatSubscribedId = chatId;
  }

  unsubscribeFromChat() {
    if (!this.root.onlineStore.socket) return;
    this.root.onlineStore.socket.off("typing", this.root.onlineStore.handleTyping);
    this.root.onlineStore.socket.off("stop typing", this.root.onlineStore.handleStopTyping);
    this.root.onlineStore.clearTypingUsers();
    this.root.onlineStore.socket.off('server-message:new', this.handleNewMessage);
    this.root.onlineStore.socket.off('editedMessage', this.handleEditedMessage);
    this.root.onlineStore.socket.off('server-message:read', this.handleMarkAsRead);
    this.currentChatSubscribedId = null;
  }

  private handleNewMessageFromChats = (updatedChat: ChatListItem) => {
    const isMyUnread = false
    // const isMyUnread = updatedChat?.unread?.userToId === AuthStore.getMyId();

    runInAction(() => {
      // 1. Обновляем массив
      const updatedChats = this.chats.map(chat =>
        chat._id === updatedChat._id
          ? { ...chat, latestMessage: updatedChat.latestMessage, unread: (isMyUnread && updatedChat.unread) ?? null }
          : chat
      );

      // 2. Сортируем по времени latestMessage
      this.chats = updatedChats.sort((a, b) => {
        const aTime = new Date(a.latestMessage?.createdAt || 0).getTime();
        const bTime = new Date(b.latestMessage?.createdAt || 0).getTime();
        return bTime - aTime;
      });
    });
  };

  private handleNewMessage = (payload: IncomingMessagePayload) => {
    const incoming = extractMessage(payload);
    if (!incoming) return;

    // const myId = authStore.getMyId?.();
    const myId = false;
    const isMyOwn = myId && incoming?.sender?._id === myId;
    if (isMyOwn) return;

    const incomingChatId =
      typeof incoming.chat === 'string' ? incoming.chat : incoming?.chat?._id;

    if (this.selectedChat?._id !== incomingChatId) return;

    let didAppendMessage = false;

    runInAction(() => {
      const exists = this.messages.some(m => m._id === incoming._id);
      if (!exists) {
        this.messages = [...this.messages, incoming];
        didAppendMessage = true;
      }
    });

    if (didAppendMessage) {
      this.notify();
    }
  };

  private handleEditedMessage = (updatedMessage: MessageDTO) => {
    runInAction(() => {
      const index = this.messages.findIndex(m => m._id === updatedMessage._id);
      if (index !== -1) {
        this.messages.splice(index, 1, {
          ...this.messages[index],
          ...updatedMessage,
        });
      }
    });
  }

  private handleMarkAsRead = (data: ReadedMessageResponse) => {
    if (data.senderId === this.opponentId) {
      runInAction(() => {
        this.lastReadedMessage = data
      });
    }
  };

  async markChatAsRead({ chatId, messageId }: { chatId: string, messageId: string }) {
    try {
      await this.chatService.markChatAsRead(chatId, messageId);
      this.root.onlineStore.emitWasReaded({ chatId, messageId })

      runInAction(() => {
        this.chats = [...this.chats.map(chat =>
          chat._id === chatId
            ? { ...chat, unread: 0 }
            : chat
        )];
      });

    } catch (err) {
      console.error("Ошибка при пометке сообщений как прочитанных:", err);
    }
  }

  async messageById(id: string): Promise<MessageByIdResponse> {
    return await this.chatService.messageByIdRequest(id);
  }

  async reportMessage(messageId: string) {
    return await this.chatService.reportMessage(messageId);
  }

  async getLastReadedMessage(props: { userId: string, chatId: string }) {
    const lastReadedMessage = await this.chatService.fetchLastReadedMessageRequest(props);
    runInAction(() => {
      this.lastReadedMessage = lastReadedMessage.data
    });
  }

}

export type ChatListItem = ChatDTO & {
  unread?: number | null | boolean;
  post?: { title?: string | null } | null;
  latestMessage?: MessageDTO | null;
};

type MessageLike = Omit<MessageDTO, "chat"> & {
  chat?: { _id?: string } | string;
};

type IncomingMessagePayload = MessageLike | { latestMessage?: MessageLike };

const extractMessage = (payload: IncomingMessagePayload): MessageLike | undefined => {
  if ('latestMessage' in payload) {
    return payload.latestMessage;
  }
  return payload as MessageLike;
};
