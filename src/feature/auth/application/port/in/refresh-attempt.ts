import { LoginResult } from '@/feature/auth/entity/login-result';

export interface RefreshAttempt {
    execute(refreshToken: string): Promise<LoginResult>;
}
