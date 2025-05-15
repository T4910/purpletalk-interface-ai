import * as t from "@/services/types"
import * as dataService from "@/services"
// Provider contains the use query stuff. 
// Can be used directly in a component or in a hook

// Here's an example of its use and why this structure is good:
/**
    const { mutate: verify2FAMutate, isLoading: isVerifying } = useVerifyTwoFactorMutation();
        verify2FAMutate(
      { token: verificationToken },
      {
        onSuccess: () => {
          showToast({ message: localize('com_ui_2fa_verified') });
          confirm2FAMutate(
            { token: verificationToken },
            {
              onSuccess: () => setPhase('backup'),
              onError: () =>
                showToast({ message: localize('com_ui_2fa_invalid'), status: 'error' }),
            },
          );
        },
        onError: () => showToast({ message: localize('com_ui_2fa_invalid'), status: 'error' }),
      },
    );

*/ 

import { useMutation, useQuery } from '@tanstack/react-query';
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { QueryKeys, MutationKeys } from "../keys";
import { toast } from "sonner";
import { router } from "@/routes";


// QUERY
export const useGetUserQuery = (
  config?: Partial<UseQueryOptions<t.TUser>>,
) => {
  return useQuery<t.TUser>({
    queryKey: [QueryKeys.user], 
    queryFn: () => dataService.getCurrentUser(), 
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
    ...config,
  }
);
};

// export const useUserRequestPasswordReset = ''


// MUTATIONS
export const useUserLoginMutation = (options?: UseMutationOptions<t.TLoginParams, t.TLoginResponse, t.TLoginParams>) => {
  return useMutation({
    mutationKey: [MutationKeys.loginUser],
    mutationFn: (payload: t.TLoginParams) => dataService.login(payload),
    ...options
  })
}

export const useUserLogoutMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.logoutUser],
    mutationFn: () => dataService.logout(),
  })
}

export const useUserRegisterMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.registerUser],
    mutationFn: (payload: t.TRegisterParams) => dataService.register(payload)
  })
}
export const useUserEmailVerification = () => {
  return useMutation({
    mutationKey: [MutationKeys.verifyEmail],
    mutationFn: (payload: t.TConfirmEmailParams) => dataService.confirmEmail(payload),
  })
}   

// export const useUserResetPassword = ''
// export const useUserResendConfirmEmail = ''
