import { AsyncResult } from '@/shared/util/entity/result';
import { Timeblock } from '@/feature/timeblocks/entity/timeblock';

export interface GetTimeblocksByIds {
    execute(userId: string, ids: string[]): AsyncResult<string, Timeblock[]>
}
