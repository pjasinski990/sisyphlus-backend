import { BlockRepo } from '@/feature/timeblocks/application/ports/out/block-repo';
import { Timeblock } from '@/feature/timeblocks/entity/timeblock';

export class InMemoryBlockRepo implements BlockRepo {
    blocks: Timeblock[] = [];

    async upsert<T extends Timeblock>(block: T): Promise<T> {
        if (this.blocks.find(b => b.id === block.id)) {
            this.blocks = this.blocks.map(b => b.id === block.id ? block : b);
        } else {
            this.blocks.push(block);
        }
        return block;
    }

    async getByUserId(userId: string): Promise<Timeblock[]> {
        return this.blocks.filter(b => b.userId === userId);
    }

    async getById(userId: string, id: string): Promise<Timeblock | null> {
        return this.blocks.find(b => b.id === id && b.userId === userId) ?? null;
    }

    async getByIds(userId: string, ids: string[]): Promise<Timeblock[]> {
        return this.blocks.filter(b => ids.includes(b.id) && b.userId === userId);
    }

    async getByLocalDate(userId: string, localDate: string): Promise<Timeblock[]> {
        return this.blocks.filter(b => b.userId === userId && b.localDate === localDate);
    }
}
