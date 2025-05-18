export type TUserContext = {
  isAuthenticated: boolean;
  // user: TUser
  redirect: string | null;
};

export type TUser = {
  id: string;
  username: string;
  email: string;
  is_active: string;
  is_2fa_enabled: string;
};

export type TBackendError = {
  string: "deal with later";
};

export type TLoginResponse = { access: string; refresh: string };

// BACKEND TYPES
export type TRefreshTokenResponse = {
  token: string;
  user: TUser;
};

export type TRegisterParams = {
  username: string;
  email: string;
  password: string;
  password2: string;
};
export type TLoginParams = { username: string; password: string };
export type TRequestPasswordResetParams = { email: string };
export type TConfirmEmailParams = { uidb64: string; token: string };
export type TResetPasswordParams = {
  uidb64: string;
  token: string;
  password: string;
  password2: string;
};
export type TResendConfirmEmailParams = { email: string };

export type TResendConfirmEmailParamsa = { email: string };

export type TAiChatParams = { session_id?: string; user_input: string };
export type TAiChatResponse = {
  session_id: string;
  agent_reply: string;
  message_id: string;
  message_timestamp: string;
  sender: string;
};

export type TConversation = {
  id: string;
  user: string;
  session_id: string;
  created_at: string;
  updated_at: string;
  messages: TMessage[];
};

export type TMessage = {
  id: string;
//   conversation: string;
  sender: "user" | "assistant";
  content: string;
    created_at: Date;
  timestamp: string;
};

export type TChatPreview = {
  id: string;
  title: string;
};

export type TChatsByDate = {
  [date: string]: TChatPreview[];
};
