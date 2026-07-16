export type LichessAccountProfile = {
  id: string;
  username: string;
};

export type LichessTokenResponse = {
  access_token: string;
  expires_in: number;
  scope?: string;
  token_type: 'Bearer';
};

export type EncryptedSecret = {
  authTag: string;
  ciphertext: string;
  iv: string;
};
