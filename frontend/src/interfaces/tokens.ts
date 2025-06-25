export interface Token {
  id?: string;
  access_token: string;
  refresh_token: string;
  access_token_expires_at?: Date;
  refresh_token_expires_at?: Date;
}
