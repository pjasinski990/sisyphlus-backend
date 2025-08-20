import { Request, Response } from 'express';
import { AccessTokenPayload } from '@/feature/auth/entity/access-token-payload';
import { Result } from '@/shared/util/entity/result';

export interface AuthenticatedData { authType: string; }
export interface GenericAuthenticatedData extends AuthenticatedData { authType: 'generic'; }
export interface JwtAuthenticatedData extends AuthenticatedData {
    authType: 'jwt';
    payload: AccessTokenPayload;
    expired: boolean;
}
export type AuthVerifyResult = Result<string, AuthenticatedData>

export type CreateAccessTokenStrategy = (ownerId: string) => Promise<string>;
export type VerifyAccessTokenStrategy = (token: string) => Promise<AuthVerifyResult>;

export type CreateRefreshTokenStrategy = (ownerId: string) => Promise<string>;

export type SetTokenStrategy = (token: string, res: Response) => Promise<void>;

export type ClearTokenStrategy = (token: string, res: Response) => Promise<void>;

export type ExtractTokenStrategy = (req: Request) => Promise<string | null>;

export type HashPasswordStrategy = (password: string) => Promise<string>;
export type VerifyPasswordStrategy = (password: string, hash: string) => Promise<AuthVerifyResult>;
