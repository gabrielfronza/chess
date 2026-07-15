import { UsersController } from './controllers';
import { UsersModule } from './users.module';

describe('UsersModule', () => {
  it('is defined with the users controller available through the barrel', () => {
    expect(UsersModule).toBeDefined();
    expect(UsersController).toBeDefined();
  });
});
