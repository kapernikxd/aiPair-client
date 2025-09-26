import { AiBotDTO } from "@/helpers/types/dtos/AiBotDto";
import { UserDTO } from "@/helpers/types";
import { getUserAvatar } from "@/helpers/utils/user";

const DEFAULT_DESCRIPTION = "Описание пока отсутствует.";

type HoverSwapCardItem = {
  id: string;
  src: string;
  avatarSrc: string;
  title: string;
  views?: number | string;
  hoverText?: string;
  href: string;
};

type AiBotLike = (AiBotDTO | UserDTO) & Partial<AiBotDTO>;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const resolveIdentifier = (bot: AiBotLike, index?: number) => {
  const candidate = [bot.botId, bot._id, bot.username, bot.name].find(isNonEmptyString);

  if (candidate) {
    return candidate.trim();
  }

  return typeof index === "number" ? `unknown-${index}` : "unknown";
};

const buildBotHref = (bot: AiBotLike, identifier: string) => {
  const hrefSource = [bot._id, bot.botId, identifier].find(isNonEmptyString) ?? identifier;

  return `/profile/ai-agent/${encodeURIComponent(hrefSource)}`;
};

const getBotDescription = (bot: AiBotLike) => {
  const description = bot.intro?.trim() || bot.userBio?.trim();

  return description && description.length > 0 ? description : DEFAULT_DESCRIPTION;
};

const getPrimaryImage = (bot: AiBotLike, fallback: string) => {
  const [firstPhoto] = Array.isArray(bot.photos) ? bot.photos : [];

  return isNonEmptyString(firstPhoto) ? firstPhoto : fallback;
};

export const mapAiBotToHoverSwapCard = (bot: AiBotLike, index?: number): HoverSwapCardItem => {
  const avatar = getUserAvatar(bot);
  const identifier = resolveIdentifier(bot, index);
  const title = isNonEmptyString(bot.name) ? bot.name.trim() : "AI Companion";

  return {
    id: identifier,
    src: getPrimaryImage(bot, avatar),
    avatarSrc: avatar,
    title,
    views: typeof bot.followers === "number" ? bot.followers.toLocaleString("ru-RU") : undefined,
    hoverText: getBotDescription(bot),
    href: buildBotHref(bot, identifier),
  };
};

export const mapAiBotsToHoverSwapCards = (bots: (AiBotDTO | UserDTO)[] = []): HoverSwapCardItem[] =>
  bots
    .filter((bot): bot is AiBotLike => Boolean(bot))
    .map((bot, index) => mapAiBotToHoverSwapCard(bot, index));

