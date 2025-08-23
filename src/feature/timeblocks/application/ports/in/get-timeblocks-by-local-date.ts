import { AsyncResult } from '@/shared/util/entity/result';
import { Timeblock } from '@/feature/timeblocks/entity/timeblock';

export interface GetTimeblocksByLocalDate {
    execute(userId: string, localDate: string): AsyncResult<string, Timeblock[]>
}
