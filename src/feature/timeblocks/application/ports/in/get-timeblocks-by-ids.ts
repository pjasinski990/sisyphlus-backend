import { AsyncResult } from '@/shared/util/entity/result';
import { Block } from '@/feature/timeblocks/entity/block';

export interface GetTimeblocksByIds {
    execute(userId: string, ids: string[]): AsyncResult<string, Block[]>
}
