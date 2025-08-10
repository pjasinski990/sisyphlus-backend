import { beforeEach, describe, expect, it } from 'vitest';
import { RefreshTokenService } from '@/feature/auth/application/service/refresh-token-service';
import { AuthDescription } from '@/feature/auth/entity/auth-description';
import { InMemoryRefreshTokenRepo } from '@/feature/auth/infra/in-memory-refresh-token-repo';
import { RefreshTokenRepo } from '@/feature/auth/application/port/out/refresh-token-repo';
import { getAuthDescription } from '@/feature/auth/application/service/get-auth-description';
import { LogoutUserUseCase } from '@/feature/auth/application/use-case/logout-user';
import { LogoutUser } from '@/feature/auth/application/port/in/logout-user';
import { returnsOkAccessTokenWith } from '@/feature/auth/infra/testing/mock-token-verify';

describe('RefreshAttemptUseCase', () => {
    let refreshTokenRepo: RefreshTokenRepo;
    let refreshTokenService: RefreshTokenService;
    let authDescription: AuthDescription;
    let useCase: LogoutUser;

    const userId = 'someUserId';
    const unusedAccessToken = 'validAccessToken';
    const unusedRefreshToken = 'validRefreshToken';

    beforeEach(() => {
        refreshTokenRepo = new InMemoryRefreshTokenRepo();
        authDescription = { ...getAuthDescription() };
        refreshTokenService = new RefreshTokenService(refreshTokenRepo, authDescription.createRefreshToken);
        useCase = new LogoutUserUseCase(refreshTokenService, authDescription);
    });

    it('returns error if access token is malformed', async () => {
        const result = await useCase.execute('malformed', unusedRefreshToken);

        expect(result).toEqual({ ok: false, error: 'Malformed access token' });
    });

    it('returns error if user does not own refresh token', async () => {
        authDescription.verifyAccessToken = returnsOkAccessTokenWith({ userId });
        const rt = await refreshTokenService.issue('not-our-user');

        const result = await useCase.execute(unusedAccessToken, rt);

        expect(result).toEqual({ ok: false, error: 'Invalid refresh token' });
    });

    it('returns ok if refresh token is not found', async () => {
        authDescription.verifyAccessToken = returnsOkAccessTokenWith({ userId });

        const result = await useCase.execute(unusedAccessToken, 'already-removed-token');

        expect(result).toEqual({ ok: true, value: 'User already logged out' });
    });

    it('removes refresh token when request correct', async () => {
        authDescription.verifyAccessToken = returnsOkAccessTokenWith({ userId });
        const rt = await refreshTokenService.issue(userId);

        const result = await useCase.execute(unusedAccessToken, rt);

        expect(result).toEqual({ ok: true, value: 'Logged out successfully' });
    });
});
