import { Result } from '@/shared/util/entity/result';
import { PublicUserData } from '@/feature/auth/entity/who-am-i-result';

export interface AuthData {
    user: PublicUserData;
    accessToken: string;
    refreshToken: string;
}

export type LoginResult = Result<AuthData, string>
