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
  credits: number;
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

// export type TProperty = {

// }

export type TPropertySnapshot = {
  id: number
  location: string
  details_url: string
  image_url: string | null
  title: string
  description: string
  bedroom: number | null
  bathroom: number | null
  listing_time: string
  amenities: string[] | null
  property_type: string
  contact: string | null
  scraped_at: string
  price: string | null
  extra_data: {
    price: string | null
    title: string
    bedroom: number | null
    listing: string | null
    location: string
    amenities: string[] | null
    bathrooms: number | null
    image_url: string | null
    description: string
    details_url: string
    phonenumber: string | null
    property_type: string
  }
  initiator: string //"user" | "system"
}

export type TFavoriteProperty = {
  id: string
  user: string
  property: TPropertySnapshot
  added_at: Date
  check_frequency: string
  last_checked: Date
  schedule_id: string
}

export type TAddToFavoriteParams = {
    url: string,
    messageId: string
    conversationId: string
}

/**
 *       "location": "The location of the house",
      "image_url": "Image of the house as scrapped",
      "details_url": "url to page to find more info on the house",
      "description":"description of the house",
      "title":"title given to the house",
      "bedroom": "no of bedrooms",
      "bathrooms": "no of bathrooms",
      "price":"price of the property",
      "listing":"when the house was listed",
      "phonenumber":"phone number of the agent",
      "amenities": ["list of amenities like swimming pool, parking, etc."],
      "property_type":"type of property (house/apartment/land)",
 */