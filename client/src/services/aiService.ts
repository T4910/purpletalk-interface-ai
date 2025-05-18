// This is what interacts with the API service
import * as endpoints from "@/services/endpoints";
import * as t from "@/services/types";
import request from "@/lib/request";

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

import type { Message } from "../store/useChatStore";

export const sendMessage = async (params: t.TAiChatParams) => {
  const ai_response = (await request.post(
    endpoints.sendAiMessage(),
    params
  )) as t.TAiChatResponse;
  return {
    id: ai_response.message_id,
    content: ai_response.agent_reply,
    session_id: ai_response.session_id,
    role: ai_response.sender,
    createdAt: ai_response.message_timestamp,
  };
};

export const getConversations = () => {
  return request.get<t.TConversation[]>(endpoints.getAllConversations());
};

export const getMessagesFromConversations = (id: string) => {
  return request.get<t.TMessage[]>(endpoints.conversationById(id));
};
