import { JwtAuthenticatedData, VerifyAccessTokenStrategy } from '@/feature/auth/entity/auth-strategy';
import { AccessTokenPayload } from '@/feature/auth/entity/access-token-payload';
import { nok, ok } from '@/shared/util/entity/result';

export function returnsOkAccessTokenWith(payload: AccessTokenPayload): VerifyAccessTokenStrategy {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return async (token: string) => ok<JwtAuthenticatedData>(okAccessTokenVerifyResponse(payload, false));
}

export function returnsExpiredAccessTokenWith(payload: AccessTokenPayload): VerifyAccessTokenStrategy {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return async (token: string) => ok<JwtAuthenticatedData>(okAccessTokenVerifyResponse(payload, true));
}

export function returnsInvalidAccessTokenWith(error: string): VerifyAccessTokenStrategy {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return async (token: string) => nok(error);
}

function okAccessTokenVerifyResponse(payload: AccessTokenPayload, expired: boolean): JwtAuthenticatedData {
    return {
        authType: 'jwt',
        expired,
        payload,
    };
}
