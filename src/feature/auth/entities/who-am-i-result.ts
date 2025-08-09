import { User } from '@/feature/auth/entities/user';
import { Result } from '@/shared/entities/result';

export type PublicUserData = Omit<User, 'passwordHash'>

export type WhoAmIResult = Result<PublicUserData, string>;

export function toPublicUserData(user: User): PublicUserData {
    const { passwordHash, ...publicFields } = user;
    void passwordHash;
    return publicFields;
}
