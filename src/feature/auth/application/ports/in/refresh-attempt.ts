import { LoginResult } from '@/feature/auth/entities/login-result';

export interface RefreshAttempt {
    execute(refreshToken: string): Promise<LoginResult>;
}
