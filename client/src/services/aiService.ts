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

export const sendMessage = async ({ session_id, user_input }: { session_id: string, user_input: string }) => {
  const ai_response = await request.post<t.TAiChatResponse>(
    endpoints.sendAiMessage(),
    { session_id, user_input }
  );
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

export const createConversation = () => {
  return request.post<t.TConversation>(endpoints.createConversation());
};

export const createConversationWithMessage = (user_input: string) => {
  return request.post(endpoints.createConversationWithMessage(), { user_input });
};
