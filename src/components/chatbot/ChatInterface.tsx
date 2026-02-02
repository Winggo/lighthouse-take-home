import { Message } from '@/lib/types/chat';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onClearError: () => void;
}

export function ChatInterface({
  messages,
  isLoading,
  error,
  onClose,
  onSendMessage,
  onClearError,
}: ChatInterfaceProps) {
  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 bg-black/50 z-30 sm:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Chat interface */}
      <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-[#2a3a36] rounded-2xl shadow-2xl z-40 flex flex-col animate-slide-in-bottom-right max-sm:inset-0 max-sm:bottom-0 max-sm:right-0 max-sm:w-full max-sm:h-full max-sm:rounded-none">
        <ChatHeader onClose={onClose} />
        <ChatMessages messages={messages} isLoading={isLoading} />
        <ChatInput
          onSendMessage={onSendMessage}
          disabled={isLoading}
          error={error}
          onClearError={onClearError}
        />
      </div>
    </>
  );
}
