import { UserDTO } from "@/types";


export interface ChatById {
  _id: string;
  isGroupChat: boolean;
  latestMessage?: string; // ID последнего сообщения
  users: UserDTO[]; // Список пользователей в чате
  chatName?: string;
  postId?: string; // ID связанного поста
  post?: unknown; // deleted from aiPair
}

export type ReadedMessageResponse = {
  senderId: string;
  chatId: string;
  lastReadedMessageId: string;
};
