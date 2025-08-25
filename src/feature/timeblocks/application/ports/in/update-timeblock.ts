import { Timeblock, UpdateBlockPayload } from '@/feature/timeblocks/entity/timeblock';
import { AsyncResult } from '@/shared/util/entity/result';

export interface UpdateTimeblock {
    execute(userId: string, patch: UpdateBlockPayload): AsyncResult<string, Timeblock>
}
