import { RefreshAttempt } from '@/feature/auth/application/ports/in/refresh-attempt';
import { AuthData, LoginResult } from '@/feature/auth/entities/login-result';
import { AuthDescription } from '@/feature/auth/entities/auth-description';
import { RefreshTokenService } from '@/feature/auth/application/services/refresh-token-service';
import { nok, ok } from '@/shared/entities/result';
import { UserRepo } from '@/feature/auth/application/ports/out/user-repo';
import { toPublicUserData } from '@/feature/auth/entities/who-am-i-result';

export class RefreshAttemptUseCase implements RefreshAttempt {
    constructor(
        private readonly userRepo: UserRepo,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly authDescription: AuthDescription,
    ) { }

    async execute(refreshToken: string): Promise<LoginResult> {
        const foundRefreshToken = await this.refreshTokenService.find(refreshToken);
        if (!foundRefreshToken) {
            return nok('Invalid refresh token - not found');
        }

        if (Date.now() > foundRefreshToken.exp) {
            await this.refreshTokenService.revoke(foundRefreshToken);
            return nok('Refresh token expired');
        }

        const userId = foundRefreshToken.ownerId;
        const existingUser = await this.userRepo.getById(userId);
        if (!existingUser) {
            await this.refreshTokenService.revoke(foundRefreshToken);
            return nok('Invalid user');
        }

        const publicUserData = toPublicUserData(existingUser);
        const newAccessToken = await this.authDescription.createAccessToken(userId);
        const newRefreshToken = await this.refreshTokenService.issue(userId);

        await this.refreshTokenService.revoke(foundRefreshToken);

        return ok<AuthData>({
            user: publicUserData,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    }
}
