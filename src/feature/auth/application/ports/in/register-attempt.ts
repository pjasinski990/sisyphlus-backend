import { RegisterResult } from '@/feature/auth/entities/register-result';

export interface RegisterAttempt {
    execute(email: string, password: string): Promise<RegisterResult>;
}
