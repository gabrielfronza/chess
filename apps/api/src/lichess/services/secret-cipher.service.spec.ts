import { ConfigService } from '@nestjs/config';
import { SecretCipherService } from './secret-cipher.service';

describe('SecretCipherService', () => {
  it('encrypts and decrypts secrets without storing plaintext', () => {
    const service = new SecretCipherService(createConfigService());

    const encrypted = service.encrypt('lichess-access-token');

    expect(encrypted.ciphertext).not.toBe('lichess-access-token');
    expect(service.decrypt(encrypted)).toBe('lichess-access-token');
  });
});

function createConfigService(): ConfigService {
  return {
    get: jest.fn(() => 'test-lichess-token-key-with-more-than-32-chars'),
  } as unknown as ConfigService;
}
