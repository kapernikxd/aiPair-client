import { makeAutoObservable, runInAction } from 'mobx';
import { BaseStore } from './BaseStore';
import type { RootStore } from './RootStore';
import { ChatDTO, MessageDTO } from '@/helpers/types';
import { ChatById, ReadedMessageResponse } from '@/services/chat/ChatResponse';
import ChatService, { FetchChatsOptions } from '@/services/chat/ChatService';

import { chatThreads } from '@/helpers/data/chats';
import { initialMessages } from '@/helpers/data/chat';
import type { ChatMessage } from '@/helpers/types/chat';
import type { ChatThread } from '@/helpers/types/chats';


export class ChatStore extends BaseStore {
  threads = [...chatThreads];
  activeThreadId: number | null = this.threads[0]?.id ?? null;
  private messagesByThread = new Map<number, ChatMessage[]>();

  private root: RootStore;

  chats: ChatDTO[] = [];
  selectedChat: ChatById | null = null;
  messages: MessageDTO[] = [];
  pinnedMessages: MessageDTO[] = [];

  lastReadedMessage: ReadedMessageResponse = {} as ReadedMessageResponse;
  opponentId: string | undefined = undefined;

  hasMoreMessages = true;
  hasMoreChats = true;
  isLoadingChats = false;

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
    } catch (e) {
      console.error("Error loading pinned messages:", e);
    }
  }

  clearPinnedMessages() {
    runInAction(() => {
      this.pinnedMessages = [];
    });
  }

  isMessagePinned(id: string) {
    return this.pinnedMessages?.some((m) => m._id === id);
  }

  async pinMessage(message: MessageDTO) {
    if (this.isMessagePinned(message._id)) return;
    if (this.pinnedMessages.length >= 5) {
      // uiStore.showSnackbar(
      //   'You can pin up to 5 messages. To pin a new message, remove one of the messages that are already pinned.',
      //   'info'
      // );
      return;
    }

    try {
      await this.chatService.pinMessage(message._id);
      runInAction(() => {
        this.pinnedMessages.push(message);
      });
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
  }

  cleanMessages() {
    this.messages = [];
  }

  cleanOpponentId() {
    this.opponentId = undefined;
  }

  get isGroupChat() {
    return this.selectedChat?.isGroupChat || false
  }

  get privateChats() {
    return this.chats.filter((chat: any) => !chat.isGroupChat && !chat.isBotChat);
  }

  get groupChats() {
    return this.chats.filter((chat: any) => chat.isGroupChat && chat?.post?.title);
  }

  get botChats() {
    return this.chats.filter((chat: any) => chat.isBotChat);
  }

  // 📌 Обновление чатов
  async refreshChats(options?: FetchChatsOptions) {
    const chatIds = await this.fetchChats({ ...options, page: 1 });
    return chatIds
  }

  async fetchChats(options?: FetchChatsOptions) {
    if (this.isLoadingChats || (!this.hasMoreChats && options?.page && options.page > 1)) return [];

    this.isLoadingChats = true;
    try {
      const response = await this.chatService.fetchChats(options);

      runInAction(() => {
        const incomingChats = response.data.chats;

        if (options?.page && options.page > 1) {
          const chatMap = new Map(this.chats.map((chat) => [chat._id, chat]));

          incomingChats.forEach((chat: ChatDTO) => {
            chatMap.set(chat._id, chat);
          });

          this.chats = Array.from(chatMap.values());
        } else {
          const chatMap = new Map<string, ChatDTO>();

          incomingChats.forEach((chat: ChatDTO) => {
            if (!chatMap.has(chat._id)) {
              chatMap.set(chat._id, chat);
            }
          });

          this.chats = Array.from(chatMap.values());
        }
        this.hasMoreChats = response.data.hasMore;
      });
      return response.data.chats.map((chat: any) => chat._id);
    } catch (err) {
      console.error("Ошибка при получении чатов:", err);
      return []
    } finally {
      runInAction(() => {
        this.isLoadingChats = false;
      });
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
    } catch (err) {
      console.error("Ошибка при получении чата:", err);
    }
  }

  async hasUnreadMessages() {
    if (this.isApiCheckedNewMessages) return;
    try {
      const { data } = await this.chatService.hasUnreadMessages();
      // onlineStore.setUnreadStatus(data);
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
      const incomingMessages = response.data.messages;

      runInAction(() => {
        const currentIds = new Set(this.messages.map((msg) => msg._id));

        const uniqueMessages = incomingMessages.filter((msg: any) => !currentIds.has(msg._id));

        if (skip === 0) {
          this.messages = incomingMessages;
        } else {
          this.messages = [...uniqueMessages, ...this.messages]; // ✅ Добавляем старые в начало
        }

        this.hasMoreMessages = incomingMessages.length === 30; // ✅ Если меньше 30, значит, больше нет
        this.updatePinnedFromMessages();
      });
    } catch (err) {
      console.error("Ошибка при получении сообщений:", err);
    }
  }

  setMessages(newMessages: MessageDTO[]) {
    runInAction(() => {
      this.messages = newMessages;
    });
  }

  async sendMessage(
    message: string,
    chatId: string,
    replyToMessageId?: string,
    images?: any, //todo refactor type
  ) {
    try {
      const { data } = await this.chatService.sendMessage(
        message,
        chatId,
        replyToMessageId,
        images
      );

      const messageData = {
        ...data.data,
        readBy: data.data.readBy ?? [],
        isEdited: data.data.isEdited ?? false,
      } as MessageDTO;

      runInAction(() => {
        this.messages.push(messageData);
      });
      this.notify();
    } catch (err) {
      // uiStore.showSnackbar("Failed", "error");
      console.error("Ошибка при отправке сообщения:", err);
    }
  }

  async editMessage(messageId: string, content: string) {
    try {
      const { data } = await this.chatService.editMessage(messageId, content);
      // onlineStore.emitEditedMessage(data.data)

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
    // if (!onlineStore.socket) return;
    console.log("📲 Подписываюсь на список чатов...");
    // важно: снять старый хендлер перед повторной подпиской
    // onlineStore.socket.off('newMessageFromChats', this.handleNewMessageFromChats);
    // onlineStore.socket.on('newMessageFromChats', this.handleNewMessageFromChats);
  }

  unsubscribeFromChats() {
    // if (!onlineStore.socket) return;
    console.log("🚪 Отписываюсь от списка чатов...");
    // onlineStore.socket.off('newMessageFromChats', this.handleNewMessageFromChats);
  }

  subscribeToChat(chatId: string) {
    // if (!onlineStore.socket) return;

    // если уже подписаны на этот же чат — ничего не делаем
    if (this.currentChatSubscribedId === chatId) return;

    // перед подпиской снимаем ВСЕ связанные хендлеры (на случай переезда между чатами)
    // onlineStore.socket.off("typing", onlineStore.handleTyping);
    // onlineStore.socket.off("stop typing", onlineStore.handleStopTyping);
    // onlineStore.socket.off('server-message:new', this.handleNewMessage);
    // onlineStore.socket.off('editedMessage', this.handleEditedMessage);
    // onlineStore.socket.off('server-message:read', this.handleMarkAsRead);

    // onlineStore.socket.on("typing", onlineStore.handleTyping);
    // onlineStore.socket.on("stop typing", onlineStore.handleStopTyping);
    // onlineStore.socket.on('server-message:new', this.handleNewMessage);
    // onlineStore.socket.on('editedMessage', this.handleEditedMessage);
    // onlineStore.socket.on('server-message:read', this.handleMarkAsRead);

    this.currentChatSubscribedId = chatId;
  }

  unsubscribeFromChat(_chatId?: string) {
    // if (!onlineStore.socket) return;
    // onlineStore.socket.off("typing", onlineStore.handleTyping);
    // onlineStore.socket.off("stop typing", onlineStore.handleStopTyping);
    // onlineStore.socket.off('server-message:new', this.handleNewMessage);
    // onlineStore.socket.off('editedMessage', this.handleEditedMessage);
    // onlineStore.socket.off('server-message:read', this.handleMarkAsRead);
    this.currentChatSubscribedId = null;
  }

  private handleNewMessageFromChats = (updatedChat: any) => {
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

  private handleNewMessage = (payload: any) => {
    // сервер может прислать либо объект latestMessage, либо готовое сообщение
    const incoming = payload?.latestMessage ?? payload;
    if (!incoming) return;

    // const myId = authStore.getMyId?.();
    const myId = false;
    const isMyOwn = myId && incoming?.sender?._id === myId;
    if (isMyOwn) return;

    const incomingChatId =
      typeof incoming.chat === 'string' ? incoming.chat : incoming?.chat?._id;

    if (this.selectedChat?._id !== incomingChatId) return;

    runInAction(() => {
      const exists = this.messages.some(m => m._id === incoming._id);
      if (!exists) {
        this.messages.push(incoming);
      }
    });
  };

  private handleEditedMessage = (updatedMessage: any) => {
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
      // onlineStore.emitWasReaded({ chatId, messageId })

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

  async messageById(id: string) {
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
