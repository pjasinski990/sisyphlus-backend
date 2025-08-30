import { Block, UpdateBlockPayload } from '@/feature/timeblocks/entity/block';
import { AsyncResult } from '@/shared/util/entity/result';

export interface UpdateTimeblock {
    execute(userId: string, patch: UpdateBlockPayload): AsyncResult<string, Block>
}
