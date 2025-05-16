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

// QUERY
export const useGetUserQuery = (
  config?: Partial<UseQueryOptions<t.TUser>>,
) => {
  return useQuery<t.TUser>({
    queryKey: [QueryKeys.user], 
    queryFn: () => dataService.getCurrentUser(), 
    refetchOnMount: false,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    // enabled: false,
    ...config,
  }
);
};

// export const useUserRequestPasswordReset = ''


// MUTATIONS
export const useUserLoginMutation = (options?: UseMutationOptions<t.TLoginResponse, t.TLoginParams, t.TLoginParams>) => {
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

export const useUserResetPassword = () => {
  return useMutation({
    mutationKey: [MutationKeys.resetPassword],
    mutationFn: (payload: t.TResetPasswordParams) => dataService.resetPassword(payload),
  })
}

export const useUserRequestPasswordReset = () => {
  return useMutation({
    mutationKey: [MutationKeys.requestPasswordReset],
    mutationFn: (payload: t.TRequestPasswordResetParams) => dataService.requestPasswordReset(payload),
  })
}

export const useUserResendConfirmEmail = () => {
  return useMutation({
    mutationKey: [MutationKeys.resendConfirmEmail],
    mutationFn: (payload: t.TResendConfirmEmailParams) => dataService.resendConfirmEmail(payload),
  })
}
