
import { create } from 'zustand';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  content: string;
  sender: MessageRole;
  created_at: Date;
}

interface ChatState {
  messages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  addMessage: (content: string, role: MessageRole) => void;
  loadPrevMessages: (messages: Message[]) => void;
  resetMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  inputValue: '',
  setInputValue: (value) => set({ inputValue: value }),
  loadPrevMessages: (messages) => set({ messages }),
  addMessage: (content, role) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Math.random().toString(36).substring(2, 9),
          content,
          sender: role,
          created_at: new Date(),
        },
      ],
      inputValue: '',
    })),
  resetMessages: () => set({ messages: [] }),
}));
