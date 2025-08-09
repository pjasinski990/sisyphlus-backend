import { LogoutResult } from '@/feature/auth/entities/logout-result';

export interface LogoutUser {
    execute(
        accessToken: string,
        refreshToken: string
    ): Promise<LogoutResult>;
}
