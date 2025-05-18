import { UseQueryOptions, useQuery, queryOptions } from "@tanstack/react-query";
import { QueryKeys } from "../keys";
import * as t from "@/services/types";
import * as dataService from "@/services";

export const useConversationsQuery = (
  config?: Partial<UseQueryOptions<t.TConversation[]>>
) => {
  return useQuery<t.TConversation[]>({ ...useConversationsOptions, ...config });
};

export const useConversationsOptions = queryOptions({
  queryKey: [QueryKeys.allConversations],
  queryFn: () => dataService.getConversations(),
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
});

export const useConversationQuery = (
  session_id: string,
  config?: Partial<UseQueryOptions<t.TMessage[]>>
) => {
  return useQuery<t.TMessage[]>({ ...useConversationOptions(session_id), ...config });
};

export const useConversationOptions = (session_id: string) =>
  queryOptions({
    queryKey: [QueryKeys.conversation, session_id],
    queryFn: () => dataService.getMessagesFromConversations(session_id),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
