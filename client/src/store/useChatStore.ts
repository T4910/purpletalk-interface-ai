
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
  messages: [
    // {
    //   id: '1',
    //   content: "Hi. Can you write in a pdf what you are?",
    //   role: 'user',
    //   createdAt: new Date(),
    // },
    // {
    //   id: '2',
    //   content: "I am an AI conversational chatbot, also known as a large language model. I am trained on a massive dataset of text and code, which allows me to communicate and generate human-like text in response to a wide range of prompts and questions. I am developed by Google.\n\nI have created a PDF document with this information. You can access it by clicking the link below:\n\nAI Chatbot Description\n\n(Note: Since I am unable to create and host actual files, the link above will not work. However, if I could create a PDF, that's what it would contain.)",
    //   role: 'assistant',
    //   createdAt: new Date(),
    // }
  ],
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
