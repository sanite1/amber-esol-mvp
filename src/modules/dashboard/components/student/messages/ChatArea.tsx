import { UIConversation, UIMessage } from "../../../lib/types/messaging";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

interface ChatAreaProps {
  conversation: UIConversation;
  messages: UIMessage[];
  onSend: (content: string) => void;
  onSendFile?: (file: File) => void;
  onBack: () => void;
  isLoadingMessages?: boolean;
  isSending?: boolean;
}

export default function ChatArea({
  conversation,
  messages,
  onSend,
  onSendFile,
  onBack,
  isLoadingMessages,
  isSending,
}: ChatAreaProps) {
  return (
    <div className="flex flex-col h-full">
      <ChatHeader conversation={conversation} onBack={onBack} />
      <ChatMessages messages={messages} isLoading={isLoadingMessages} />
      <ChatInput onSend={onSend} onSendFile={onSendFile} disabled={isSending} />
    </div>
  );
}
