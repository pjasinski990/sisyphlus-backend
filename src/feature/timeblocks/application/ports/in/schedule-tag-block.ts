import { AsyncResult } from '@/shared/util/entity/result';
import { TagBlock } from '@/feature/timeblocks/entity/block';
import { ScheduleTagBlockDesc } from '@/feature/timeblocks/entity/schedule-block-description';

export interface ScheduleTagBlock {
    execute(userId: string, desc: ScheduleTagBlockDesc): AsyncResult<string, TagBlock>
}
