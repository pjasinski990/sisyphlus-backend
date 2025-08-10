import { User } from '@/feature/auth/entity/user';
import { Result } from '@/shared/util/entity/result';

export type RegisterResult = Result<User, string>
