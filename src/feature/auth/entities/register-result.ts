import { User } from '@/feature/auth/entities/user';
import { Result } from '@/shared/entities/result';

export type RegisterResult = Result<User, string>
