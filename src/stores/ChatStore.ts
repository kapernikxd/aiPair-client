import { makeAutoObservable } from 'mobx';
import { BaseStore } from './BaseStore';
import type { RootStore } from './RootStore';
import { chatThreads } from '@/helpers/data/chats';
import { initialMessages } from '@/helpers/data/chat';
import type { ChatMessage } from '@/helpers/types/chat';
import type { ChatThread } from '@/helpers/types/chats';

export class ChatStore extends BaseStore {
  private root: RootStore;
  threads = [...chatThreads];
  activeThreadId: number | null = this.threads[0]?.id ?? null;
  private messagesByThread = new Map<number, ChatMessage[]>();

  constructor(root: RootStore) {
    super();
    this.root = root;
    makeAutoObservable(this);
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

  sendMessage(content: string, speaker = 'You') {
    if (this.activeThreadId === null) return;
    const next: ChatMessage = {
      id: Date.now(),
      speaker,
      timestamp: 'Now',
      content,
      align: speaker === 'You' ? 'right' : 'left',
    };
    const current = this.activeMessages;
    this.messagesByThread.set(this.activeThreadId, [...current, next]);
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
}
