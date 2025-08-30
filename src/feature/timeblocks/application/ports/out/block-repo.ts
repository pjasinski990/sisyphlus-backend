import { Block } from '@/feature/timeblocks/entity/block';

export interface BlockRepo {
    upsert<T extends Block>(block: T): Promise<T>;
    getByUserId(userId: string): Promise<Block[]>;
    getById(userId: string, id: string): Promise<Block | null>;
    getByIds(userId: string, ids: string[]): Promise<Block[]>;
    getByLocalDate(userId: string, localDate: string): Promise<Block[]>;
    removeById(userId: string, id: string): Promise<Block | null>;
}
