import { LogoutUser } from '@/feature/auth/application/port/in/logout-user';
import { RefreshTokenService } from '@/feature/auth/application/service/refresh-token-service';
import { nok, ok } from '@/shared/util/entity/result';
import { LogoutResult } from '@/feature/auth/entity/logout-result';
import { AuthDescription } from '@/feature/auth/entity/auth-description';
import { extractUserId } from '@/feature/auth/application/service/access-token-utils';

export class LogoutUserUseCase implements LogoutUser {
    constructor(
        private readonly refreshTokenService: RefreshTokenService,
        private readonly authDescription: AuthDescription,
    ) { }

    async execute(accessToken: string, refreshToken: string): Promise<LogoutResult> {
        const userId = await extractUserId(accessToken, this.authDescription.verifyAccessToken);
        const rt = await this.refreshTokenService.find(refreshToken);

        if (!userId) {
            return nok('Malformed access token');
        }

        if (!rt) {
            return ok('User already logged out');
        }

        if (rt.ownerId !== userId) {
            return nok('Invalid refresh token');
        }

        await this.refreshTokenService.revoke(rt);
        return ok('Logged out successfully');
    }
}
