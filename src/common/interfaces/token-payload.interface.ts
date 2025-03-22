export interface TokenPayload {
  sub: string;
  username: string;
  iat?: number;
  exp?: number;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
