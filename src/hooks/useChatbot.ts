import { useReducer, useCallback } from 'react';
import { Message } from '@/lib/types/chat';

interface ChatbotState {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

type ChatbotAction =
  | { type: 'TOGGLE_OPEN' }
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'CLEAR_ERROR' };

function chatbotReducer(state: ChatbotState, action: ChatbotAction): ChatbotState {
  switch (action.type) {
    case 'TOGGLE_OPEN':
      return { ...state, isOpen: !state.isOpen };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.message] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

const INITIAL_GREETING: Message = {
  id: crypto.randomUUID(),
  role: 'assistant',
  content: "Hi! I'm your O-1 Visa assistant. Ask me anything about the O-1 visa process, criteria, or how to build your case.",
  timestamp: new Date()
};

export function useChatbot() {
  const [state, dispatch] = useReducer(chatbotReducer, {
    isOpen: false,
    messages: [INITIAL_GREETING],
    isLoading: false,
    error: null
  });

  const toggleOpen = useCallback(() => {
    dispatch({ type: 'TOGGLE_OPEN' });
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    dispatch({ type: 'ADD_MESSAGE', message: userMessage });
    dispatch({ type: 'SET_LOADING', isLoading: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Prepare message history (limit to last 20 messages to prevent token limit issues)
      const recentMessages = [...state.messages, userMessage].slice(-20);

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: recentMessages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to get response' }));
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      // Add assistant response
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_MESSAGE', message: assistantMessage });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        error: error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  }, [state.messages]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return {
    isOpen: state.isOpen,
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    toggleOpen,
    sendMessage,
    clearError
  };
}
