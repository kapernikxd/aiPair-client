import { makeAutoObservable } from 'mobx';
import { BaseStore } from './BaseStore';
import type { RootStore } from './RootStore';
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
import type { EditableProfile, TalkieCard } from '@/helpers/types/profile';

export type PublicProfile = {
  name: string;
  intro: string;
  location: string;
  avatar: string;
  badges: string[];
  talkies: TalkieCard[];
};

export class ProfileStore extends BaseStore {
  private root: RootStore;
  profile: EditableProfile = { ...initialProfile };
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
    return this.genderLabels[this.profile.gender] ?? this.profile.gender;
  }

  updateProfile(next: EditableProfile) {
    this.profile = { ...next };
    this.notify();
  }

  resetProfile() {
    this.profile = { ...initialProfile };
    this.notify();
  }
}
