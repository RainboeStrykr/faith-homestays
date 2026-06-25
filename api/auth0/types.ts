export type TokenResponse = {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
};

export type SessionPayload = {
  auth0Sub: string;
};

export type Auth0UserInfo = {
  sub: string;
  name: string;
  email: string;
  picture: string;
};
