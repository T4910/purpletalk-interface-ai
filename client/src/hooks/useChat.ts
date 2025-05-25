import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as aiService from '@/services/aiService';
import { QueryKeys } from '@/services/keys';

export function useCreateConversationWithMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user_input: string) => aiService.createConversationWithMessage(user_input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.allConversations] });
    },
  });
}

export function useSendAiMessage() {
  return useMutation({
    mutationFn: aiService.sendMessage,
  });
}
