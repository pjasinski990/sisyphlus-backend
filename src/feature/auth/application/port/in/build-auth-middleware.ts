import { Middleware } from '@/feature/auth/entity/middleware';
import { ExtractTokenStrategy, VerifyAccessTokenStrategy } from '@/feature/auth/entity/auth-strategy';

export interface BuildAuthMiddleware {
    execute(getToken: ExtractTokenStrategy, strategy: VerifyAccessTokenStrategy): Middleware;
}
