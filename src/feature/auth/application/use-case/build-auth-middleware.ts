import { ExtractTokenStrategy, VerifyAccessTokenStrategy } from '@/feature/auth/entity/auth-strategy';
import { NextFunction, Request, Response } from 'express';
import { InternalServerError, UnauthorizedError } from '@/shared/util/entity/http-error';
import { BuildAuthMiddleware } from '@/feature/auth/application/port/in/build-auth-middleware';
import { Middleware } from '@/feature/auth/entity/middleware';
import { isJwtAuthenticatedData } from '@/feature/auth/application/service/access-token-utils';

export class BuildAuthMiddlewareUseCase implements BuildAuthMiddleware {
    execute(getToken: ExtractTokenStrategy, verifyToken: VerifyAccessTokenStrategy): Middleware {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            void res;

            const token = await getToken(req);
            if (!token) return next(new UnauthorizedError('Missing access token'));

            const resCheck = await verifyToken(token);
            if (!resCheck.ok) {
                return next(new UnauthorizedError(resCheck.error));
            }

            if (!isJwtAuthenticatedData(resCheck.value)) {
                return next(new InternalServerError('Unexpected authorization result type'));
            }

            if (resCheck.value.expired) {
                return next(new UnauthorizedError('Access token expired'));
            }

            req.authToken = resCheck.value.payload;
            next();
        };
    }
}
