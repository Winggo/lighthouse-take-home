'use client';

import { useChatbot } from '@/hooks/useChatbot';
import { ChatbotButton } from './ChatbotButton';
import { ChatInterface } from './ChatInterface';

export function ChatbotWidget() {
  const {
    isOpen,
    messages,
    isLoading,
    error,
    toggleOpen,
    sendMessage,
    clearError,
  } = useChatbot();

  return (
    <>
      <ChatbotButton onClick={toggleOpen} isOpen={isOpen} />
      {isOpen && (
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          error={error}
          onClose={toggleOpen}
          onSendMessage={sendMessage}
          onClearError={clearError}
        />
      )}
    </>
  );
}
