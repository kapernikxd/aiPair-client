import { ProfileMinData } from "../profile";
import { UserDTO } from "./UserDto";

export interface AiBotDTO extends UserDTO {
  photos?: string[];
  usefulness?: string[];
  intro?: string;
  categories?: string[];
  botId: string;
  createdBy: ProfileMinData;
  aiPrompt: string;
}

export interface AiBotDetails {
  aiPrompt: string;
  photos?: string[];
  usefulness?: string[];
  intro?: string;
  categories?: string[];
  botId?: string;
  createdBy?: ProfileMinData;
}
