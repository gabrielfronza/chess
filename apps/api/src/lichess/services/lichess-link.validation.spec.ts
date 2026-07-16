import { BadRequestException } from '@nestjs/common';
import { validateCompleteLichessOAuth } from './lichess-link.validation';

describe('validateCompleteLichessOAuth', () => {
  it('trims callback code and state', () => {
    expect(
      validateCompleteLichessOAuth({
        code: ' code ',
        state: ' state ',
      }),
    ).toEqual({
      code: 'code',
      state: 'state',
    });
  });

  it('rejects invalid callback payloads', () => {
    expect(() => validateCompleteLichessOAuth({ code: '', state: '' })).toThrow(
      BadRequestException,
    );
  });
});
