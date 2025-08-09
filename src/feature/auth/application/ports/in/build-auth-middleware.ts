import { Middleware } from '@/feature/auth/entities/middleware';
import { ExtractTokenStrategy, VerifyAccessTokenStrategy } from '@/feature/auth/entities/auth-strategy';

export interface BuildAuthMiddleware {
    execute(getToken: ExtractTokenStrategy, strategy: VerifyAccessTokenStrategy): Middleware;
}
