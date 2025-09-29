// src/stores/OnlineStore.ts
import { makeAutoObservable, runInAction } from 'mobx';
import type { Socket } from 'socket.io-client';
import { UnreadStatus } from '@/services/chat/ChatService';
import { MessageDTO } from '@/helpers/types';
import { connectSocket } from '@/helpers/http/socket';
import { BaseStore } from './BaseStore';
import { RootStore } from './RootStore';

type AppStateStatus = 'active' | 'inactive' | 'background';

const getInitialAppState = (): AppStateStatus => {
  if (typeof document === 'undefined') {
    return 'active';
  }
  return document.visibilityState === 'hidden' ? 'background' : 'active';
};

export type OnlineUser = { userId: string; isOnline: boolean };

export class OnlineStore extends BaseStore {
  private root: RootStore;

  onlineUsers: OnlineUser[] = [];
  socket: Socket | null = null;
  isConnected = false;
  isConnecting = false;               // NEW
  appState: AppStateStatus = getInitialAppState();

  typingUsers: { userId: string; userName: string }[] = [];
  isSubscribed = false;

  hasUserNotification = false;
  hasUserNewMessage = false;
  hasUnreadGroup = false;
  hasUnreadPrivate = false;
  hasUnreadBot = false;

  currentRoutName: string = "";

  /** комнаты, которые нужно заджойнить после коннекта/реконнекта */
  private pendingRooms = new Set<string>();    // NEW


  constructor(root: RootStore) {
    super();
    this.root = root;
    makeAutoObservable(this);
  }
  

  setCurrentRoutName = (value: string) => {
    runInAction(() => { this.currentRoutName = value; });
  }

  handleAppStateChange = async (nextAppState: AppStateStatus) => {
    const wasActive = this.appState === 'active';
    const isBecomingInactive = nextAppState !== 'active';
    if (wasActive && isBecomingInactive) {
      console.log('⛔ App is going to background or inactive');
      // Можно НЕ дисконнектить на iOS, но если хочешь — оставь:
      // this.disconnectSocket();
    }

    const wasInactive = this.appState !== 'active';
    const isNowActive = nextAppState === 'active';
    if (wasInactive && isNowActive) {
      console.log('🚀 App is active');
      await this.connectSocket();        // дождёмся подключения
      this.flushPendingJoins();          // и восстановим комнаты
    }

    this.appState = nextAppState;
  }

  /** Промис, который резолвится после 'connect' (или если уже подключены) */
  private waitForConnect(): Promise<void> {    // NEW
    if (this.socket?.connected && this.isConnected) return Promise.resolve();
    return new Promise((resolve) => {
      const onConnect = () => {
        this.socket?.off?.('connect', onConnect);
        resolve();
      };
      this.socket?.on?.('connect', onConnect);
    });
  }

  /** Подключаемся к серверу (и умеем переподключаться) */
  async connectSocket() {
    if (this.isConnected && this.socket?.connected) return;
    if (this.isConnecting) {
      await this.waitForConnect();
      return;
    }

    const userId = this.root?.authStore.getMyId();
    if (!userId) return;

    this.isConnecting = true;

    // Если сокет уже создан, но не подключён — переподключим
    if (this.socket && !this.socket.connected) {
      this.socket.connect();
      await this.waitForConnect();
      runInAction(() => { this.isConnected = true; this.isConnecting = false; });
      this.afterConnect(userId);
      return;
    }

    // Иначе создаём сокет
    this.socket = connectSocket(userId);

    this.socket.on('connect', () => {
      runInAction(() => { this.isConnected = true; this.isConnecting = false; });
      this.afterConnect(userId);
    });

    this.socket.on('reconnect', () => {        // NEW: auto re-join
      runInAction(() => { this.isConnected = true; });
      this.afterConnect(userId);
    });

    this.socket.on('disconnect', () => {
      runInAction(() => {
        this.isConnected = false;
        this.onlineUsers = [];
      });
    });

    // бизнес-события
    this.registerSocketEvents();

    // дождёмся подключения, если нужно
    await this.waitForConnect().catch(() => { });
  }

  /** Действия сразу после connect/reconnect */
  private afterConnect(userId: string) {       // NEW
    this.socket?.emit?.('online', userId);
    this.flushPendingJoins();
  }

  /** отправить все отложенные joinChats */
  private flushPendingJoins() {                // NEW
    if (!this.socket?.connected || !this.pendingRooms.size) return;
    const rooms = Array.from(this.pendingRooms);
    this.socket.emit('joinChats', rooms);
    this.pendingRooms.clear();
  }

  async ensureConnectedAndJoined(chatsId: string[]) {
    if (chatsId?.length) {
      chatsId.forEach(id => this.pendingRooms.add(id));
    }
    await this.connectSocket();   // дождёмся реального 'connect'
    this.flushPendingJoins();     // сразу дожмём join
  }

  disconnectSocket() {
    const userId = this.root.authStore.getMyId();
    try {
      if (this.socket && userId) {
        this.socket.emit('offline', userId);
        this.removeSocketEvents();
        this.socket.disconnect();
      }
    } finally {
      runInAction(() => {
        this.isConnected = false;
        this.isConnecting = false;
        this.onlineUsers = [];
        this.socket = null;
      });
    }
  }

  registerSocketEvents() {
    if (!this.socket) return;
    this.socket.on('get-users', this.setOnlineUsers);
    this.socket.on("server-message:newNotification", () => this.setUserNotification(true));
    this.socket.on("server-message:newMessage", this.handleNewMessageForTab);
  }

  removeSocketEvents() {
    if (!this.socket) return;
    this.socket.off('get-users', this.setOnlineUsers);
    this.socket.off("server-message:newNotification");
    this.socket.off("server-message:newMessage");
  }

  setOnlineUsers = (users: OnlineUser[]) => {
    runInAction(() => {
      this.onlineUsers = users;
      this.typingUsers = this.typingUsers.filter(u =>
        users.some(s => s.userId === u.userId && s.isOnline)
      );
    });
  };

  setUserNotification = (value: boolean) => {
    runInAction(() => { this.hasUserNotification = value; });
  }

  setUnreadStatus = (status: UnreadStatus) => {
    runInAction(() => {
      this.hasUserNewMessage = status.hasUnread;
      this.hasUnreadGroup = status.group;
      this.hasUnreadPrivate = status.private;
      this.hasUnreadBot = status.bot;
    });
  }

  setHasUnreadGroup = (value: boolean) => {
    runInAction(() => {
      this.hasUnreadGroup = value;
      this.hasUserNewMessage = this.hasUnreadGroup || this.hasUnreadPrivate || this.hasUnreadBot;
    });
  }

  setHasUnreadPrivate = (value: boolean) => {
    runInAction(() => {
      this.hasUnreadPrivate = value;
      this.hasUserNewMessage = this.hasUnreadGroup || this.hasUnreadPrivate || this.hasUnreadBot;
    });
  }

  setHasUnreadBot = (value: boolean) => {
    runInAction(() => {
      this.hasUnreadBot = value;
      this.hasUserNewMessage = this.hasUnreadGroup || this.hasUnreadPrivate || this.hasUnreadBot;
    });
  }

  handleNewMessageForTab = (typeMessage: 'newPrivateMessage' | 'newGroupMessage' | 'newBotMessage') => {
    // NB: имя роута должно совпадать с навигатором
    if (this.currentRoutName === "chatMessages") {  // FIX: было "chatScreen"
      return;
    }
    runInAction(() => {
      this.hasUserNewMessage = true;
      if (typeMessage === 'newGroupMessage') this.hasUnreadGroup = true;
      if (typeMessage === 'newPrivateMessage') this.hasUnreadPrivate = true;
      if (typeMessage === 'newBotMessage') this.hasUnreadBot = true;
    });
  }

  setUserNewMessage = (value: boolean) => {
    runInAction(() => { this.hasUserNewMessage = value; });
  }

  getIsUserOnline(userId: string) {
    return this.onlineUsers.some(user => user.userId === userId);
  }

  handleTyping = (data: { userId: string; userName: string }) => {
    runInAction(() => { this.setTypingStatus(data.userId, data.userName, true); });
  };
  handleStopTyping = (userId: string) => {
    runInAction(() => { this.setTypingStatus(userId, "", false); });
  };

  setTypingStatus(userId: string, userName: string, isTyping: boolean) {
    runInAction(() => {
      const exists = this.typingUsers.some(u => u.userId === userId);

      if (isTyping) {
        if (exists) {
          this.typingUsers = this.typingUsers.map((user) =>
            user.userId === userId ? { userId, userName } : user,
          );
        } else {
          this.typingUsers = [...this.typingUsers, { userId, userName }];
        }
      } else if (exists) {
        this.typingUsers = this.typingUsers.filter(u => u.userId !== userId);
      }
    });
    this.notify();
  }

  clearTypingUsers() {
    runInAction(() => {
      this.typingUsers = [];
    });
    this.notify();
  }

  getTypingUsers() { return this.typingUsers; }

  emitTyping(chatId: string) {
    if (!this.socket?.connected) return;
    this.socket.emit("typing", {
      room: chatId,
      userId: this.root.authStore.getMyId(),
      userName: this.root.authStore.user?.fullName,
    });
  }

  emitStopTyping(chatId: string) {
    if (!this.socket?.connected) return;
    this.socket.emit("stop typing", {
      room: chatId,
      userId: this.root.authStore.getMyId(),
    });
  }

  emitEditedMessage(message: MessageDTO) {
    if (!this.socket?.connected) return;
    this.socket.emit('editedMessage', message);
  }

  emitWasReaded({ chatId, messageId }: { chatId: string, messageId: string }) {
    if (!this.socket?.connected) return;
    this.socket.emit("message:read", {
      chatId, messageId, senderId: this.root.authStore.getMyId(),
    });
  }

  /** Безопасный join: складываем в pending и шлём сразу, если подключены */
  emitJoinChats(chatsId: string[]) {
    if (!chatsId?.length) return;
    chatsId.forEach(id => this.pendingRooms.add(id));
    if (this.socket?.connected) {
      this.flushPendingJoins();
    }
  }
}
