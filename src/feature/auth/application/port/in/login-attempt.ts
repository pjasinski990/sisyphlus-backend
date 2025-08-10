import { LoginResult } from '@/feature/auth/entity/login-result';

export interface LoginAttempt {
    execute(email: string, password: string): Promise<LoginResult>;
}
