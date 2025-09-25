import type { LucideIcon } from "lucide-react";
import { PushNotificationSettings } from "./dtos";

export type AvatarFile = { uri: string; name: string; type: string };

export interface ProfilesFilterParams {
  page?: number;
  limit?: number;
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
  gender?: 'MALE' | 'FEMALE',
}

export type TalkieStat = {
    label: string;
    value: string;
    icon: LucideIcon;
};


export type AiAgentCard = {
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