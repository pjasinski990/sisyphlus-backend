import { GetLoggedInUser } from '@/feature/auth/application/port/in/get-logged-in-user';
import { AuthDescription } from '@/feature/auth/entity/auth-description';
import { UserRepo } from '@/feature/auth/application/port/out/user-repo';
import { extractUserId } from '@/feature/auth/application/service/access-token-utils';
import { PublicUserData, toPublicUserData, WhoAmIResult } from '@/feature/auth/entity/who-am-i-result';
import { nok, ok } from '@/shared/util/entity/result';

export class GetLoggedInUserUseCase implements GetLoggedInUser {
    constructor(
        private readonly userRepo: UserRepo,
        private readonly authDescription: AuthDescription
    ) { }

    async execute(accessToken: string): Promise<WhoAmIResult> {
        const userId = await extractUserId(accessToken, this.authDescription.verifyAccessToken);
        if (!userId) {
            return nok('Malformed access token');
        }

        const user = await this.userRepo.getById(userId);
        if (!user) {
            return nok(`No such user: ${userId}`);
        }

        const userData = toPublicUserData(user);
        return ok<PublicUserData>(userData);
    }
}
