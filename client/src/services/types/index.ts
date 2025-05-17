export type TUserContext = {
    isAuthenticated: boolean
    // user: TUser
    redirect: string | null
}

export type TUser = {
    id: string
    username: string
    email: string ,
    is_active: string,
    is_2fa_enabled: string
}

export type TBackendError = {
    string: 'deal with later'
}

export type TLoginResponse = { access: string, refresh: string }


// BACKEND TYPES
export type TRefreshTokenResponse = {
    token: string;
    user: TUser;
};

export type TRegisterParams = { username: string; email: string; password: string, password2: string }
export type TLoginParams = { username: string; password: string }
export type TRequestPasswordResetParams = { email: string }
export type TConfirmEmailParams = { uidb64: string; token: string }
export type TResetPasswordParams = { uidb64: string; token: string; password: string, password2: string }
export type TResendConfirmEmailParams = { email: string }

export type TResendConfirmEmailParamsa = { email: string }