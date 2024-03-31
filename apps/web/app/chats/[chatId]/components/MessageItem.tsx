import { IChatMessage } from "@/lib/interfaces/interfaces";

interface IMessageItem {
  isOwnMessage: boolean;
  isGroupChatMessage: boolean;
  message: IChatMessage;
}

const MessageItem: React.FC<IMessageItem> = ({
  isOwnMessage,
  isGroupChatMessage,
  message,
}) => {
  return <div>MessageItem</div>;
};

export default MessageItem;
