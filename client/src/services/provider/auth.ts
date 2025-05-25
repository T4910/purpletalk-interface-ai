import * as t from "@/services/types";
import * as dataService from "@/services";
import {
  queryOptions,
  useMutation,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { QueryKeys, MutationKeys } from "../keys";

// QUERY
export const useGetUserQuery = (config?: Partial<UseQueryOptions<t.TUser>>) => {
  return useQuery<t.TUser>({ ...useGetUserQueryOptions, ...config });
};

export const useIsAuthenticated = () => {
  const { data: user, isError } = useQuery({ ...useGetUserQueryOptions });
  if (isError) return false;
  return !!user?.id;
};

export const useIsActive = () => {
  const user = useSuspenseQuery(useGetUserQueryOptions);
  return !!user?.data.is_active;
};

export const useGetUserQueryOptions = queryOptions({
  queryKey: [QueryKeys.user],
  queryFn: () => dataService.getCurrentUser(),
  refetchOnMount: false,
  // gcTime: 5 * 60 * 1000,
  staleTime: 4 * 60 * 1000,
  // staleTime: Infinity,
  retry: false,
  throwOnError: false,
  // enabled: checkAuth,
});

// export const useConversationMessages = queryOptions({
//   queryKey: [QueryKeys.conversationMessages],
//   queryFn: () => dataService.getConversationMessages(),
//   refetchOnMount: false,
// })

// MUTATIONS
export const useUserLoginMutation = (
  options?: UseMutationOptions<t.TLoginResponse, t.TLoginParams, t.TLoginParams>
) => {
  return useMutation({
    mutationKey: [MutationKeys.loginUser],
    mutationFn: (payload: t.TLoginParams) => dataService.login(payload),
    ...options,
  });
};

export const useUserLogoutMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.logoutUser],
    mutationFn: () => dataService.logout(),
    onSuccess(data, variables, context) {
      console.log("data", data);
      console.log("variables", variables);
      console.log("context", context);
    },
  });
};

export const useUserRegisterMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.registerUser],
    mutationFn: (payload: t.TRegisterParams) => dataService.register(payload),
  });
};
export const useUserEmailVerification = () => {
  return useMutation({
    mutationKey: [MutationKeys.verifyEmail],
    mutationFn: (payload: t.TConfirmEmailParams) =>
      dataService.confirmEmail(payload),
  });
};

export const useUserResetPassword = () => {
  return useMutation({
    mutationKey: [MutationKeys.resetPassword],
    mutationFn: (payload: t.TResetPasswordParams) =>
      dataService.resetPassword(payload),
  });
};

export const useUserRequestPasswordReset = () => {
  return useMutation({
    mutationKey: [MutationKeys.requestPasswordReset],
    mutationFn: (payload: t.TRequestPasswordResetParams) =>
      dataService.requestPasswordReset(payload),
  });
};

export const useUserResendConfirmEmail = () => {
  return useMutation({
    mutationKey: [MutationKeys.resendConfirmEmail],
    mutationFn: (payload: t.TResendConfirmEmailParams) =>
      dataService.resendConfirmEmail(payload),
  });
};
