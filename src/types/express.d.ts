import { AccessTokenPayload } from '@/feature/auth/entities/access-token-payload';

declare global {
    namespace Express {
        interface Request {
            authToken?: AccessTokenPayload;
        }
    }
}

export {};
