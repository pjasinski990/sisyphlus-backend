import { WhoAmIResult } from '@/feature/auth/entity/who-am-i-result';

export interface GetLoggedInUser {
    execute(accessToken: string): Promise<WhoAmIResult>;
}
