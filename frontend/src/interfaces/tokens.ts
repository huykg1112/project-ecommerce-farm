export interface Token {
  id?: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
}
