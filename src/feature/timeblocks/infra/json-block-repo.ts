import path from 'path';
import { promises as fs } from 'fs';
import { BlockRepo } from '@/feature/timeblocks/application/ports/out/block-repo';
import { Block } from '@/feature/timeblocks/entity/block';

export class JsonBlockRepo implements BlockRepo {
    private readonly dbPath: string;

    constructor() {
        this.dbPath = path.resolve(process.cwd(), 'mockdb', 'blocks.json');
    }

    async removeById(userId: string, id: string): Promise<Block | null> {
        const blocks = await this.readAll();
        const idx = blocks.findIndex(b => b.id === id && b.userId === userId);
        if (idx === -1) return null;
        const [removed] = blocks.splice(idx, 1);
        await this.writeAll(blocks);
        return removed ?? null;
    }

    async upsert<T extends Block>(block: T): Promise<T> {
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

    async getByUserId(userId: string): Promise<Block[]> {
        const blocks = await this.readAll();
        return blocks.filter(b => b.userId === userId);
    }

    async getById(userId: string, id: string): Promise<Block | null> {
        const blocks = await this.readAll();
        return blocks.find(b => b.id === id && b.userId === userId) ?? null;
    }

    async getByIds(userId: string, ids: string[]): Promise<Block[]> {
        const blocks = await this.readAll();
        return blocks.filter(b => ids.includes(b.id) && b.userId === userId);
    }

    async getByLocalDate(userId: string, localDate: string): Promise<Block[]> {
        const blocks = await this.readAll();
        return blocks.filter(b => b.userId === userId && b.localDate === localDate);
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

    private async readAll(): Promise<Block[]> {
        await this.ensureFileExists();
        const raw = await fs.readFile(this.dbPath, 'utf-8');
        try {
            return JSON.parse(raw) as Block[];
        } catch {
            return [];
        }
    }

    private async writeAll(blocks: Block[]): Promise<void> {
        await this.ensureFileExists();
        await fs.writeFile(this.dbPath, JSON.stringify(blocks, null, 2), 'utf-8');
    }
}
