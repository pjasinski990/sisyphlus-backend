import { AccessTokenPayload } from '@/feature/auth/entity/access-token-payload';

declare global {
    namespace Express {
        interface Request {
            authToken?: AccessTokenPayload;
        }
    }
}

export {};
