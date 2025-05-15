import request from "@/lib/request";
import * as endpoints from "@/services/endpoints";
import * as t from "@/services/types"

export const register = (params: t.TRegisterParams) => {
    return request.post(endpoints.register(), params);
}

type TLoginResponse = { access: string, refresh: string }
export const login = (params: t.TLoginParams): Promise<TLoginResponse> => {
    return request.post(endpoints.login(), params);
}

// get user
export const getCurrentUser = () => {
    return request.get<t.TUser>(endpoints.user());
}

// logout
export const logout = () => {
    return request.post(endpoints.logout());
}

// request password reest
export const requestPasswordReset = (params: t.TRequestPasswordResetParams) => {
    return request.post(endpoints.requestPasswordReset(), params);
}

// reset password
export const resetPassword = ({ uid, token, ...params}: t.TResetPasswordParams) => {
    return request.post(endpoints.resetPassword(uid, token), params);
}

// confirm email
export const confirmEmail = (params: t.TConfirmEmailParams) => {
    return request.post(endpoints.verifyEmail(), params);
}

// resend confirmation email 
export const resendConfirmEmail = (params: t.TResendConfirmEmailParams) => {
    return request.post(endpoints.resendVerifyEmail(), params);
}

// 2fa setup

// password reset

// confirm email


// 2fa setup
// 2fa verify