import { ScheduleTaskBlock } from '@/feature/timeblocks/application/ports/in/schedule-task-block';
import { ScheduleBlockDesc } from '@/feature/timeblocks/entity/schedule-block-description';
import { TaskBlock, Block, UpdateBlockPayload } from '@/feature/timeblocks/entity/block';
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
import { UpdateTimeblock } from '@/feature/timeblocks/application/ports/in/update-timeblock';
import { UpdateTimeblockUseCase } from '@/feature/timeblocks/application/use-case/update-timeblock-use-case';
import { RemoveTimeblock } from '@/feature/timeblocks/application/ports/in/remove-timeblock';
import { RemoveTimeblockUseCase } from '@/feature/timeblocks/application/use-case/remove-timeblock-use-case';

export class TimeblockController {
    constructor(
        private readonly scheduleTaskBlock: ScheduleTaskBlock,
        private readonly updateTimeblock: UpdateTimeblock,
        private readonly getTimeblocksByLocalDate: GetTimeblocksByLocalDate,
        private readonly getTimeblocksByIds: GetTimeblocksByIds,
        private readonly removeTimeblock: RemoveTimeblock,
    ) { }

    async handleScheduleTimeblock(userId: string, desc: ScheduleBlockDesc): AsyncResult<string, TaskBlock> {
        if (!desc.taskId) {
            throw new ValidationError('tag scheduling not implemented');
        }
        return this.scheduleTaskBlock.execute(userId, desc);
    }

    async handleUpdateTimeblock(userId: string, patch: UpdateBlockPayload): AsyncResult<string, Block> {
        return this.updateTimeblock.execute(userId, patch);
    }

    async handleGetByLocalDate(userId: string, localDate: string): AsyncResult<string, Block[]> {
        return this.getTimeblocksByLocalDate.execute(userId, localDate);
    }

    async handleGetByIds(userId: string, ids: string[]): AsyncResult<string, Block[]> {
        return this.getTimeblocksByIds.execute(userId, ids);
    }

    async handleRemoveTimeblock(userId: string, blockId: string): AsyncResult<string, Block> {
        return this.removeTimeblock.execute(userId, blockId);
    }
}

const blockRepo = new JsonBlockRepo();
const scheduleTaskBlock = new ScheduleTaskBlockUseCase(blockRepo);
const updateTimeblock = new UpdateTimeblockUseCase(blockRepo);
const getTimeblocksByLocalDate = new GetTimeblocksByLocalDateUseCase(blockRepo);
const getTimeblocksByIds = new GetTimeblocksByIdsUseCase(blockRepo);
const removeTimeblock = new RemoveTimeblockUseCase(blockRepo);

export const timeblockController = new TimeblockController(
    scheduleTaskBlock,
    updateTimeblock,
    getTimeblocksByLocalDate,
    getTimeblocksByIds,
    removeTimeblock,
);
