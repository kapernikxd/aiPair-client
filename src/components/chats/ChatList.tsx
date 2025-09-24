import { AuthRouteKey } from "@/helpers/hooks/useAuthRoutes";
import { ChatThread } from "../../helpers/types/chats";
import ChatListItem from "./ChatListItem";

export default function ChatList({
  threads,
  routeFor,
  onSelect,
}: {
  threads: ChatThread[];
  routeFor: (routeKey: AuthRouteKey) => string;
  onSelect?: (thread: ChatThread) => void;
}) {
  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-2 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur">
      <ul className="divide-y divide-white/5 overflow-hidden rounded-[28px]">
        {threads.map((t) => (
          <ChatListItem key={t.id} thread={t} href={routeFor(t.routeKey)} onSelect={onSelect} />
        ))}
      </ul>
    </div>
  );
}
