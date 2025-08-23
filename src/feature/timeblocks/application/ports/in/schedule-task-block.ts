import { TaskBlock } from '@/feature/timeblocks/entity/timeblock';
import { AsyncResult } from '@/shared/util/entity/result';
import { ScheduleTaskBlockDesc } from '@/feature/timeblocks/entity/schedule-block-description';

export interface ScheduleTaskBlock {
    execute(userId: string, desc: ScheduleTaskBlockDesc): AsyncResult<string, TaskBlock>
}
