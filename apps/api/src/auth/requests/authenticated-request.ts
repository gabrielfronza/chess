import { Request } from 'express';
import { AuthenticatedUser } from '../types';

export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};
