import { AiBotDTO } from "@/helpers/types/dtos/AiBotDto";
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

const resolveIdentifier = (bot: AiBotDTO) =>
  bot._id ?? bot.botId ?? bot.username ?? bot.name ?? "unknown";

const buildBotHref = (bot: AiBotDTO) => {
  const identifier = resolveIdentifier(bot);

  return `/profile/ai-agent/${encodeURIComponent(identifier)}`;
};

const getBotDescription = (bot: AiBotDTO) => {
  const description = bot.intro?.trim() || bot.userBio?.trim();

  return description && description.length > 0 ? description : DEFAULT_DESCRIPTION;
};

const getPrimaryImage = (bot: AiBotDTO, fallback: string) => {
  const [firstPhoto] = bot.photos ?? [];

  return firstPhoto ?? fallback;
};

export const mapAiBotToHoverSwapCard = (bot: AiBotDTO): HoverSwapCardItem => {
  const avatar = getUserAvatar(bot);
  const identifier = resolveIdentifier(bot);

  return {
    id: identifier.toString(),
    src: getPrimaryImage(bot, avatar),
    avatarSrc: avatar,
    title: bot.name ?? "AI Companion",
    views: typeof bot.followers === "number" ? bot.followers.toLocaleString("ru-RU") : undefined,
    hoverText: getBotDescription(bot),
    href: buildBotHref(bot),
  };
};

export const mapAiBotsToHoverSwapCards = (bots: AiBotDTO[]): HoverSwapCardItem[] =>
  bots.map((bot) => mapAiBotToHoverSwapCard(bot));

