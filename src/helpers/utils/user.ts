import { BASE_URL } from "../http";
import { UserBasicDTO, UserDTO } from "../types";
import { capitalizeFirstLetter } from "./common";


const IMAGE_MOCK = '/img/noProfile.jpg'

export const getUserId = (user: UserDTO) => (user ? user._id : undefined);

export const getUserFullName = (user: UserDTO | UserBasicDTO) =>
  user ? `${capitalizeFirstLetter(user.name)} ${capitalizeFirstLetter(user.lastname)}` : "";

export const getUsername = (user: UserDTO) =>
  user && user.username ? `@${user.username.toLowerCase()}` : null;

export const getUserEmail = (user: UserDTO) =>
  user && user.email ? user.email : null;

export const getUserPhone = (user: UserDTO) =>
  user && user.phone ? user.phone : null;

export const getUserAvatar = (user: UserDTO | UserBasicDTO) =>
  user?.avatarFile
    ? `${BASE_URL}images/${user.avatarFile}`
    : IMAGE_MOCK;

export const getUserLink = (user: UserDTO) =>
  user ? `profile/${user._id}` : undefined;

type WithCity = Pick<UserDTO, 'city'> | null | undefined;

export const getUserCountryCode = (user: WithCity) =>
  user?.city?.countryCode ?? undefined;

export const getUserCity = (user: UserDTO) =>
  user && user?.city?.name ? user.city.name.toUpperCase() : undefined;

export const getUserFollowerCount = (user: UserDTO) =>
  
  user && user.followers ? user.followers : 0;
export const getUserFollowingCount = (user: UserDTO) =>
  user && user.following ? user.following : 0;

export const getUserEventsCount = (events?: Array<unknown> | null) =>
  events ? events.length : 0;

export const convertPhoneFormat = (phone: string) =>
  phone
    .replace(/\D+/g, "")
    .replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "+$1 ($2) $3-$4-$5");
