import { AuthDescription } from '@/feature/auth/entity/auth-description';
import {
    clearAccessTokenFromCookie,
    createJwtAccessToken,
    extractAccessTokenFromCookie,
    setAccessTokenToCookie,
    verifyJwtAccessToken
} from '@/feature/auth/application/service/access-token-strategies';
import {
    clearRefreshTokenFromCookie,
    createRandomToken,
    extractRefreshTokenFromCookie,
    setRefreshTokenToCookie
} from '@/feature/auth/application/service/refresh-token-strategies';
import { bcryptHashStrategy, bcryptVerifyStrategy } from '@/feature/auth/application/service/password-strategies';

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
