import { RefreshTokenRepo } from '@/feature/auth/application/port/out/refresh-token-repo';
import { RefreshToken } from '@/feature/auth/entity/refresh-token';
import path from 'path';
import { promises as fs } from 'fs';

export class JsonRefreshTokenRepo implements RefreshTokenRepo {
    private readonly dbPath: string;

    constructor() {
        this.dbPath = path.resolve(process.cwd(), 'mockdb', 'refresh-token.json');
    }

    async getByOwnerId(ownerId: string): Promise<RefreshToken[]> {
        const tokens = await this.readAll();
        return tokens.filter(token => token.ownerId === ownerId);
    }

    async upsert(token: RefreshToken): Promise<RefreshToken> {
        let tokens = await this.readAll();
        if (tokens.find(rt => rt.id === token.id)) {
            tokens = tokens.map(rt => rt.id === token.id ? token : rt);
        } else {
            tokens.push(token);
            await this.writeAll(tokens);
        }
        return token;
    }

    async remove(id: string): Promise<void> {
        let tokens = await this.readAll();
        tokens = tokens.filter((rt) => rt.id !== id);
        await this.writeAll(tokens);
    }

    async getByHash(valueHash: string): Promise<RefreshToken | null> {
        const tokens = await this.readAll();
        const result = tokens.find(token => token.valueHash === valueHash);
        return result ?? null;
    }

    private async ensureFileExists() {
        const dir = path.dirname(this.dbPath);
        await fs.mkdir(dir, { recursive: true });
        try {
            await fs.access(this.dbPath);
        } catch {
            await fs.writeFile(this.dbPath, '[]', 'utf-8');
        }
    }

    private async readAll(): Promise<RefreshToken[]> {
        await this.ensureFileExists();
        const raw = await fs.readFile(this.dbPath, 'utf-8');
        try {
            return JSON.parse(raw) as RefreshToken[];
        } catch {
            return [];
        }
    }

    private async writeAll(tokens: RefreshToken[]): Promise<void> {
        await this.ensureFileExists();
        await fs.writeFile(this.dbPath, JSON.stringify(tokens, null, 2), 'utf-8');
    }
}
