import { LoginResult } from '@/feature/auth/entity/login-result';
import { RegisterResult } from '@/feature/auth/entity/register-result';
import { InMemoryRefreshTokenRepo } from '@/feature/auth/infra/in-memory-refresh-token-repo';
import { LoginAttempt } from '@/feature/auth/application/port/in/login-attempt';
import { RegisterAttempt } from '@/feature/auth/application/port/in/register-attempt';
import { RefreshTokenService } from '@/feature/auth/application/service/refresh-token-service';
import { LoginAttemptUseCase } from '@/feature/auth/application/use-case/login-attempt';
import { RegisterAttemptUseCase } from '@/feature/auth/application/use-case/register-attempt';
import { getAuthDescription } from '@/feature/auth/application/service/get-auth-description';
import { RefreshAttempt } from '@/feature/auth/application/port/in/refresh-attempt';
import { RefreshAttemptUseCase } from '@/feature/auth/application/use-case/refresh-attempt';
import { GetLoggedInUser } from '@/feature/auth/application/port/in/get-logged-in-user';
import { GetLoggedInUserUseCase } from '@/feature/auth/application/use-case/get-logged-in-user';
import { WhoAmIResult } from '@/feature/auth/entity/who-am-i-result';
import { LogoutUser } from '@/feature/auth/application/port/in/logout-user';
import { LogoutUserUseCase } from '@/feature/auth/application/use-case/logout-user';
import { LogoutResult } from '@/feature/auth/entity/logout-result';
import { JsonUserRepo } from '@/feature/auth/infra/json-user-repo';

export class AuthController {
    constructor(
        private readonly loginAttempt: LoginAttempt,
        private readonly refreshAttempt: RefreshAttempt,
        private readonly registerAttempt: RegisterAttempt,
        private readonly getLoggedInUser: GetLoggedInUser,
        private readonly logUserOut: LogoutUser,
    ) { }

    onLoginAttempt(email: string, password: string): Promise<LoginResult> {
        return this.loginAttempt.execute(email, password);
    }

    onRefreshAttempt(refreshToken: string): Promise<LoginResult> {
        return this.refreshAttempt.execute(refreshToken);
    }

    async onLogout(accessToken: string, refreshToken: string): Promise<LogoutResult> {
        return await this.logUserOut.execute(accessToken, refreshToken);
    }

    onRegisterAttempt(email: string, password: string): Promise<RegisterResult> {
        return this.registerAttempt.execute(email, password);
    }

    onWhoAmIRequest(accessToken: string): Promise<WhoAmIResult> {
        return this.getLoggedInUser.execute(accessToken);
    }
}

const userRepo = new JsonUserRepo();
const tokenRepo = new InMemoryRefreshTokenRepo();
const authDescription = getAuthDescription();
const refreshTokenService = new RefreshTokenService(tokenRepo, authDescription.createRefreshToken);

export const authController = new AuthController(
    new LoginAttemptUseCase(userRepo, refreshTokenService, authDescription),
    new RefreshAttemptUseCase(userRepo, refreshTokenService, authDescription),
    new RegisterAttemptUseCase(userRepo, authDescription),
    new GetLoggedInUserUseCase(userRepo, authDescription),
    new LogoutUserUseCase(refreshTokenService, authDescription),
);
