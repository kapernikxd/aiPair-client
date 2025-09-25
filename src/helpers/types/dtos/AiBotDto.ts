import { Highlight, Opening } from "@/helpers/types/ai-agent";
import { UserDTO } from "./UserDto";

export interface AiBotDTO extends UserDTO {
  curatorLabel?: string;
  tagline?: string;
  introduction?: string;
  intro?: string;
  introMessage?: string;
  signatureMoves?: string[];
  highlights?: Highlight[];
  openings?: Opening[];
  statsChips?: string[];
  chatLink?: string;
}
