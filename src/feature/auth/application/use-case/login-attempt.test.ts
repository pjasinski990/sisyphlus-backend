import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginAttemptUseCase } from '@/feature/auth/application/use-case/login-attempt';
import { InMemoryRefreshTokenRepo } from '@/feature/auth/infra/in-memory-refresh-token-repo';
import { InMemoryUserRepo } from '@/feature/auth/infra/in-memory-user-repo';
import { RefreshTokenService } from '@/feature/auth/application/service/refresh-token-service';
import { AuthDescription } from '@/feature/auth/entity/auth-description';
import { getAuthDescription } from '@/feature/auth/application/service/get-auth-description';
import { plainHashStrategy, plainVerifyStrategy } from '@/feature/auth/application/service/password-strategies';
import { User } from '@/feature/auth/entity/user';
import { AuthData } from '@/feature/auth/entity/login-result';
import { expectResultError, expectResultOk } from '@/shared/util/testing/assertion';

describe('login attempt use case', () => {
    let authDescription: AuthDescription;
    let userRepo: InMemoryUserRepo;
    let refreshTokenRepo: InMemoryRefreshTokenRepo;
    let refreshTokenService: RefreshTokenService;
    let useCase: LoginAttemptUseCase;

    const testUser: User = {
        id: 'someId',
        email: 'testEmail',
        passwordHash: 'testPassword',
    };

    beforeEach(() => {
        authDescription = { ...getAuthDescription() };
        authDescription.hashPassword = plainHashStrategy;
        authDescription.verifyPassword = plainVerifyStrategy;
        authDescription.createAccessToken = vi.fn().mockResolvedValue('dummy-access-token');
        authDescription.createRefreshToken = vi.fn().mockResolvedValue('dummy-refresh-token');
        userRepo = new InMemoryUserRepo();
        refreshTokenRepo = new InMemoryRefreshTokenRepo();
        refreshTokenService = new RefreshTokenService(refreshTokenRepo, authDescription.createRefreshToken);
        useCase = new LoginAttemptUseCase(userRepo, refreshTokenService, authDescription);
    });

    it('should pass with valid password', async () => {
        await userRepo.upsert(testUser);
        const { passwordHash, ...publicUserData } =  testUser;
        void passwordHash;

        const result = await useCase.execute(testUser.email, testUser.passwordHash);

        expectResultOk<AuthData>(result);
        expect(result.value.accessToken).toBe('dummy-access-token');
        expect(result.value.refreshToken).toBe('dummy-refresh-token');
        expect(result.value.user).to.deep.equal(publicUserData);
    });

    it('should fail when user does not exist', async () => {
        const result = await useCase.execute('notfound@email.com', 'irrelevant');
        expectResultError<string>(result);
        expect(result.error).toBe('User does not exist');
    });

    it('should fail with wrong password', async () => {
        await userRepo.upsert(testUser);
        const result = await useCase.execute(testUser.email, 'wrongPassword');
        expectResultError<string>(result);
        expect(result.error).toBe('Invalid password');
    });

    it('should fail if password is empty', async () => {
        await userRepo.upsert(testUser);
        const result = await useCase.execute(testUser.email, '');
        expectResultError<string>(result);
        expect(result.error).toBe('Invalid password');
    });

    it('should return correct tokens on success', async () => {
        await userRepo.upsert(testUser);
        const result = await useCase.execute(testUser.email, testUser.passwordHash);
        expectResultOk<AuthData>(result);
        expect(result.value.accessToken).toBe('dummy-access-token');
        expect(result.value.refreshToken).toBe('dummy-refresh-token');
    });

    it('should not create tokens on failed login', async () => {
        await userRepo.upsert(testUser);
        const accessSpy = vi.spyOn(authDescription, 'createAccessToken');
        const refreshSpy = vi.spyOn(refreshTokenService, 'issue');
        await useCase.execute(testUser.email, 'wrongPassword');
        expect(accessSpy).not.toHaveBeenCalled();
        expect(refreshSpy).not.toHaveBeenCalled();
    });
});
