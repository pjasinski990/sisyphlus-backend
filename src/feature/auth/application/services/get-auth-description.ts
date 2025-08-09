import { AuthDescription } from '@/feature/auth/entities/auth-description';
import {
    clearAccessTokenFromCookie,
    createJwtAccessToken,
    extractAccessTokenFromCookie,
    setAccessTokenToCookie,
    verifyJwtAccessToken
} from '@/feature/auth/application/services/access-token-strategies';
import {
    clearRefreshTokenFromCookie,
    createRandomToken,
    extractRefreshTokenFromCookie,
    setRefreshTokenToCookie
} from '@/feature/auth/application/services/refresh-token-strategies';
import { bcryptHashStrategy, bcryptVerifyStrategy } from '@/feature/auth/application/services/password-strategies';

const authDescription: AuthDescription = {
    createAccessToken: createJwtAccessToken,
    setAccessToken: setAccessTokenToCookie,
    clearAccessToken: clearAccessTokenFromCookie,
    extractAccessToken: extractAccessTokenFromCookie,
    verifyAccessToken: verifyJwtAccessToken,

    createRefreshToken: createRandomToken,
    setRefreshToken: setRefreshTokenToCookie,
    clearRefreshToken: clearRefreshTokenFromCookie,
    extractRefreshToken: extractRefreshTokenFromCookie,

    hashPassword: bcryptHashStrategy,
    verifyPassword: bcryptVerifyStrategy,
};

export const getAuthDescription = () => authDescription;
