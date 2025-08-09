import { WhoAmIResult } from '@/feature/auth/entities/who-am-i-result';

export interface GetLoggedInUser {
    execute(accessToken: string): Promise<WhoAmIResult>;
}
