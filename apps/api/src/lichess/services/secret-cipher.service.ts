import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from '../../config/environment';
import { EncryptedSecret } from '../types';

@Injectable()
export class SecretCipherService {
  constructor(
    private readonly configService: ConfigService<Environment, true>,
  ) {}

  encrypt(plaintext: string): EncryptedSecret {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const ciphertext = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);

    return {
      authTag: cipher.getAuthTag().toString('base64url'),
      ciphertext: ciphertext.toString('base64url'),
      iv: iv.toString('base64url'),
    };
  }

  decrypt(secret: EncryptedSecret): string {
    const decipher = createDecipheriv(
      'aes-256-gcm',
      this.key,
      Buffer.from(secret.iv, 'base64url'),
    );
    decipher.setAuthTag(Buffer.from(secret.authTag, 'base64url'));

    return Buffer.concat([
      decipher.update(Buffer.from(secret.ciphertext, 'base64url')),
      decipher.final(),
    ]).toString('utf8');
  }

  private get key(): Buffer {
    return createHash('sha256')
      .update(
        this.configService.get('LICHESS_TOKEN_ENCRYPTION_KEY', {
          infer: true,
        }),
      )
      .digest();
  }
}
