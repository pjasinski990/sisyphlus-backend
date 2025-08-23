import { Timeblock } from '@/feature/timeblocks/entity/timeblock';

export interface BlockRepo {
    upsert<T extends Timeblock>(block: T): Promise<T>;
    getByUserId(userId: string): Promise<Timeblock[]>;
    getById(userId: string, id: string): Promise<Timeblock | null>;
    getByIds(userId: string, ids: string[]): Promise<Timeblock[]>;
    getByLocalDate(userId: string, localDate: string): Promise<Timeblock[]>;
}
