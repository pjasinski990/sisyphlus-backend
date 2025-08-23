import path from 'path';
import { promises as fs } from 'fs';
import { BlockRepo } from '@/feature/timeblocks/application/ports/out/block-repo';
import { Timeblock } from '@/feature/timeblocks/entity/timeblock';
import { logger } from '@/shared/feature/logging/interface/controller/logging-controller';

export class JsonBlockRepo implements BlockRepo {
    private readonly dbPath: string;

    constructor() {
        this.dbPath = path.resolve(process.cwd(), 'mockdb', 'blocks.json');
    }

    async upsert<T extends Timeblock>(block: T): Promise<T> {
        const blocks = await this.readAll();
        const idx = blocks.findIndex(b => b.id === block.id);
        if (idx !== -1) {
            blocks[idx] = block;
        } else {
            blocks.push(block);
        }
        await this.writeAll(blocks);
        return block;
    }

    async getByUserId(userId: string): Promise<Timeblock[]> {
        const blocks = await this.readAll();
        return blocks.filter(b => b.userId === userId);
    }

    async getById(userId: string, id: string): Promise<Timeblock | null> {
        const blocks = await this.readAll();
        return blocks.find(b => b.id === id && b.userId === userId) ?? null;
    }

    async getByIds(userId: string, ids: string[]): Promise<Timeblock[]> {
        const blocks = await this.readAll();
        return blocks.filter(b => ids.includes(b.id) && b.userId === userId);
    }

    async getByLocalDate(userId: string, localDate: string): Promise<Timeblock[]> {
        const blocks = await this.readAll();
        const res = blocks.filter(b => b.userId === userId && b.localDate === localDate);
        return res;
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

    private async readAll(): Promise<Timeblock[]> {
        await this.ensureFileExists();
        const raw = await fs.readFile(this.dbPath, 'utf-8');
        try {
            return JSON.parse(raw) as Timeblock[];
        } catch {
            return [];
        }
    }

    private async writeAll(blocks: Timeblock[]): Promise<void> {
        await this.ensureFileExists();
        await fs.writeFile(this.dbPath, JSON.stringify(blocks, null, 2), 'utf-8');
    }
}
