import { RegisterResult } from '@/feature/auth/entity/register-result';

export interface RegisterAttempt {
    execute(email: string, password: string): Promise<RegisterResult>;
}
