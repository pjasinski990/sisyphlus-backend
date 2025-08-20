import { RefreshTokenRepo } from '@/feature/auth/application/port/out/refresh-token-repo';
import { RefreshToken } from '@/feature/auth/entity/refresh-token';

export class InMemoryRefreshTokenRepo implements RefreshTokenRepo {
    tokens: RefreshToken[] = [];

    async getByOwnerId(ownerId: string): Promise<RefreshToken[]> {
        return this.tokens.filter(token => token.ownerId === ownerId);
    }

    async upsert(token: RefreshToken): Promise<RefreshToken> {
        if (this.tokens.find(rt => rt.id === token.id)) {
            this.tokens = this.tokens.map(rt => rt.id === token.id ? token : rt);
        } else {
            this.tokens.push(token);
        }
        return token;
    }

    async remove(id: string): Promise<void> {
        this.tokens = this.tokens.filter((rt) => rt.id !== id);
    }

    async getByHash(valueHash: string): Promise<RefreshToken | null> {
        const result = this.tokens.find(token => token.valueHash === valueHash);
        return result ?? null;
    }
}
