import { AsyncResult } from '@/shared/util/entity/result';
import { Block } from '@/feature/timeblocks/entity/block';

export interface RemoveTimeblock {
    execute(userId: string, blockId: string): AsyncResult<string, Block>
}
