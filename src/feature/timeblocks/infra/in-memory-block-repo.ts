import { BlockRepo } from '@/feature/timeblocks/application/ports/out/block-repo';
import { Block } from '@/feature/timeblocks/entity/block';

export class InMemoryBlockRepo implements BlockRepo {
    blocks: Block[] = [];

    async upsert<T extends Block>(block: T): Promise<T> {
        if (this.blocks.find(b => b.id === block.id)) {
            this.blocks = this.blocks.map(b => b.id === block.id ? block : b);
        } else {
            this.blocks.push(block);
        }
        return block;
    }

    async removeById(userId: string, id: string): Promise<Block | null> {
        const idx = this.blocks.findIndex(b => b.id === id && b.userId === userId);
        if (idx === -1) return null;
        const [removed] = this.blocks.splice(idx, 1);
        return removed ?? null;
    }

    async getByUserId(userId: string): Promise<Block[]> {
        return this.blocks.filter(b => b.userId === userId);
    }

    async getById(userId: string, id: string): Promise<Block | null> {
        return this.blocks.find(b => b.id === id && b.userId === userId) ?? null;
    }

    async getByIds(userId: string, ids: string[]): Promise<Block[]> {
        return this.blocks.filter(b => ids.includes(b.id) && b.userId === userId);
    }

    async getByLocalDate(userId: string, localDate: string): Promise<Block[]> {
        return this.blocks.filter(b => b.userId === userId && b.localDate === localDate);
    }
}
