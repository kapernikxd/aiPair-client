import { AuthStore } from './AuthStore';
import { ProfileStore } from './ProfileStore';
import { ChatStore } from './ChatStore';
import { UiStore } from './UiStore';
import { AiBotStore } from './AiBotStore';
import { OnlineStore } from './OnlineStore';

export class RootStore {
  readonly authStore: AuthStore;
  readonly profileStore: ProfileStore;
  readonly chatStore: ChatStore;
  readonly uiStore: UiStore;
  readonly aiBotStore: AiBotStore;
  readonly onlineStore: OnlineStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.profileStore = new ProfileStore(this);
    this.chatStore = new ChatStore(this);
    this.uiStore = new UiStore(this);
    this.aiBotStore = new AiBotStore(this);
    this.onlineStore = new OnlineStore(this);
  }
}
