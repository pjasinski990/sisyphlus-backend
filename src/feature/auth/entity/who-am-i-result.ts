import { User } from '@/feature/auth/entity/user';
import { Result } from '@/shared/util/entity/result';

export type PublicUserData = Omit<User, 'passwordHash'>

export type WhoAmIResult = Result<string, PublicUserData>;

export function toPublicUserData(user: User): PublicUserData {
    const { passwordHash, ...publicFields } = user;
    void passwordHash;
    return publicFields;
}
