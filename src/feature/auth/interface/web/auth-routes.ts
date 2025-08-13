import { Request, Router } from 'express';
import { LoginRequest, LoginRequestSchema } from '@/feature/auth/entity/login-request';
import { RegisterRequest, RegisterRequestSchema } from '@/feature/auth/entity/register-request';
import { UnauthorizedError, ValidationError } from '@/shared/util/entity/http-error';
import { authController } from '@/feature/auth/interface/controller/auth-controller';
import { getAuthDescription } from '@/feature/auth/application/service/get-auth-description';
import { asyncWrapper } from '@/shared/util/async-wrapper';

export const authRoutes = Router();

authRoutes.post('/login', asyncWrapper(async (req, res) => {
    const { email, password } = parseLoginData(req);
    const loginResult = await authController.onLoginAttempt(email, password);
    if (!loginResult.ok) {
        throw new ValidationError(`${loginResult.error}`);
    }
    const authDescription = getAuthDescription();
    await authDescription.setAccessToken(loginResult.value.accessToken, res);
    await authDescription.setRefreshToken(loginResult.value.refreshToken, res);
    res.json({ message: 'Login successful' });
}));

authRoutes.post('/logout', asyncWrapper(async (req, res) => {
    const authDescription = getAuthDescription();
    const at = await authDescription.extractAccessToken(req) ?? '';
    const rt = await authDescription.extractRefreshToken(req) ?? '';
    const result = await authController.onLogout(at, rt);
    await authDescription.clearAccessToken(at, res);
    await authDescription.clearRefreshToken(rt, res);

    if (!result.ok) {
        throw new ValidationError(result.error);
    }
    res.json({ message: result.value });
}));

authRoutes.get('/refresh', asyncWrapper(async (req, res) => {
    const rt = await getAuthDescription().extractRefreshToken(req);
    if (!rt) {
        throw new UnauthorizedError('Missing refresh token. Please log in again.');
    }
    const refreshResult = await authController.onRefreshAttempt(rt);
    if (!refreshResult.ok) {
        throw new ValidationError(`Error during refresh: ${refreshResult.error}`);
    }

    const authDescription = getAuthDescription();
    await authDescription.setAccessToken(refreshResult.value.accessToken, res);
    await authDescription.setRefreshToken(refreshResult.value.refreshToken, res);
    res.json({ message: 'Tokens refreshed.' });
}));

authRoutes.post('/register', asyncWrapper(async (req, res) => {
    const { email, password } = parseRegisterData(req);
    const registerResult = await authController.onRegisterAttempt(email, password);
    if (!registerResult.ok) {
        throw new ValidationError(`${registerResult.error}`);
    }

    res.json({ message: 'Register successful. Please proceed to login.' });
}));

authRoutes.get('/me', asyncWrapper(async (req, res) => {
    const at = await getAuthDescription().extractAccessToken(req);
    if (!at) {
        throw new UnauthorizedError('Missing token. Please log in again.');
    }
    const meResult = await authController.onWhoAmIRequest(at);
    if (!meResult.ok) {
        throw new UnauthorizedError(`Error processing "me" request: ${meResult.error}`);
    }
    res.json( { user: meResult.value });
}));

function parseLoginData(req: Request): LoginRequest {
    const parseResult = LoginRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
        throw new ValidationError('Invalid login request', parseResult.error.flatten());
    }
    return parseResult.data;
}

function parseRegisterData(req: Request): RegisterRequest {
    const parseResult = RegisterRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
        throw new ValidationError('Invalid register request', parseResult.error.flatten());
    }
    return parseResult.data;
}
