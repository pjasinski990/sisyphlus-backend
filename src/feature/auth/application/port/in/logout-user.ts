import { LogoutResult } from '@/feature/auth/entity/logout-result';

export interface LogoutUser {
    execute(
        accessToken: string,
        refreshToken: string
    ): Promise<LogoutResult>;
}
