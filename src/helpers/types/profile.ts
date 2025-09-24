import type { LucideIcon } from "lucide-react";
import { PushNotificationSettings } from "./dtos";

export interface ProfilesFilterParams {
  page?: number;
}

export type UpdateProfileProps = {
  lastname?: string,
  name?: string,
  phone?: string,
  profession?: string,
  userBio?: string,
  username?: string,
  socialMediaLinks?: {
    facebook?: string,
    instagram?: string,
    vk?: string,
  }
  pushNotificationSettings?: PushNotificationSettings,
}

export type TalkieStat = {
    label: string;
    value: string;
    icon: LucideIcon;
};


export type TalkieCard = {
    name: string;
    image: string;
    description: string;
    stats: TalkieStat[];
};


export type EditableProfile = {
    userName: string;
    gender: string;
    intro: string;
    relationshipPreference: string;
};