import { ScheduleTaskBlock } from '@/feature/timeblocks/application/ports/in/schedule-task-block';
import { ScheduleBlockDesc } from '@/feature/timeblocks/entity/schedule-block-description';
import { TaskBlock, Timeblock } from '@/feature/timeblocks/entity/timeblock';
import { AsyncResult } from '@/shared/util/entity/result';
import { ValidationError } from '@/shared/util/entity/http-error';
import { ScheduleTaskBlockUseCase } from '@/feature/timeblocks/application/use-case/schedule-task-block-use-case';
import { JsonBlockRepo } from '@/feature/timeblocks/infra/json-block-repo';
import { GetTimeblocksByLocalDate } from '@/feature/timeblocks/application/ports/in/get-timeblocks-by-local-date';
import { GetTimeblocksByIds } from '@/feature/timeblocks/application/ports/in/get-timeblocks-by-ids';
import { GetTimeblocksByIdsUseCase } from '@/feature/timeblocks/application/use-case/get-timeblocks-by-ids-use-case';
import {
    GetTimeblocksByLocalDateUseCase
} from '@/feature/timeblocks/application/use-case/get-timeblocks-by-local-date-use-case';

export class TimeblockController {
    constructor(
        private readonly scheduleTaskBlock: ScheduleTaskBlock,
        private readonly getTimeblocksByLocalDate: GetTimeblocksByLocalDate,
        private readonly getTimeblocksByIds: GetTimeblocksByIds,
    ) { }

    async handleScheduleTimeblock(userId: string, desc: ScheduleBlockDesc): AsyncResult<string, TaskBlock> {
        if (!desc.taskId) {
            throw new ValidationError('tag scheduling not implemented');
        }
        return this.scheduleTaskBlock.execute(userId, desc);
    }

    async handleGetByLocalDate(userId: string, localDate: string): AsyncResult<string, Timeblock[]> {
        return this.getTimeblocksByLocalDate.execute(userId, localDate);
    }

    async handleGetByIds(userId: string, ids: string[]): AsyncResult<string, Timeblock[]> {
        return this.getTimeblocksByIds.execute(userId, ids);
    }
}

const blockRepo = new JsonBlockRepo();
const scheduleTaskBlock = new ScheduleTaskBlockUseCase(blockRepo);
const getTimeblocksByLocalDate = new GetTimeblocksByLocalDateUseCase(blockRepo);
const getTimeblocksByIds = new GetTimeblocksByIdsUseCase(blockRepo);

export const timeblockController = new TimeblockController(
    scheduleTaskBlock,
    getTimeblocksByLocalDate,
    getTimeblocksByIds,
);
