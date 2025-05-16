// This is what interacts with the API service

/**
 * e.g
 * export const listSharedLinks = async (
  params: q.SharedLinksListParams,
): Promise<q.SharedLinksResponse> => {
  const { pageSize, isPublic, sortBy, sortDirection, search, cursor } = params;

  return request.get(
    endpoints.getSharedLinks(pageSize, isPublic, sortBy, sortDirection, search, cursor),
  );
};

export function getSharedLink(conversationId: string): Promise<t.TSharedLinkGetResponse> {
  return request.get(endpoints.getSharedLink(conversationId));
}
 */

import { Message } from "../store/useChatStore";

// This is a mock service that simulates API calls to an AI service
export const sendMessage = async (message: string): Promise<Message> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));
  
  // Mock responses based on user input
  let response = "I'm not sure how to respond to that. Can you be more specific?";
  
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    response = "Hello! How can I assist you today?";
  } else if (lowerMessage.includes("help")) {
    response = "I'm here to help! What do you need assistance with?";
  } else if (lowerMessage.includes("pdf") || lowerMessage.includes("document")) {
    response = "I can help you with documents and PDFs. However, I can't create actual files that can be downloaded. I can provide information and text content that you could copy into a PDF yourself.";
  } else if (lowerMessage.includes("who are you") || lowerMessage.includes("what are you")) {
    response = "I am an AI assistant designed to help answer questions and provide information on a wide range of topics. I can assist with explanations, creative content, and more.";
  } else {
    // Generic responses for other inputs
    const genericResponses = [
      "That's an interesting question. Let me think about that for a moment...\n\nBased on my knowledge, I would say that it depends on the specific context and details. Could you provide more information?",
      "I understand you're asking about that. From what I know, there are several perspectives to consider. Would you like me to elaborate on any particular aspect?",
      "Thanks for your message. I'm processing your request and can provide some insights. Is there a specific angle you're most interested in?",
      "I appreciate your question. This is a topic with various dimensions to explore. Let me share what I know about it.",
    ];
    response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
  }
  
  return {
    id: Math.random().toString(36).substring(2, 9),
    content: response,
    role: "assistant",
    createdAt: new Date(),
  };
}
