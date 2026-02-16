import { Conversation, Message } from "../../../data/student/messagesData";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

interface Props {
  conversation: Conversation;
  messages: Message[];
  onSend: (content: string) => void;
  onBack: () => void;
}

export default function ChatArea({
  conversation,
  messages,
  onSend,
  onBack,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      <ChatHeader conversation={conversation} onBack={onBack} />
      <ChatMessages messages={messages} />
      <ChatInput onSend={onSend} />
    </div>
  );
}
