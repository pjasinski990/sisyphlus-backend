import { ScheduleTaskBlock } from '@/feature/timeblocks/application/ports/in/schedule-task-block';
import { AsyncResult, nok, ok } from '@/shared/util/entity/result';
import { TaskBlock } from '@/feature/timeblocks/entity/timeblock';
import { BlockRepo } from '@/feature/timeblocks/application/ports/out/block-repo';
import { ScheduleBlockDesc, ScheduleTaskBlockDesc } from '@/feature/timeblocks/entity/schedule-block-description';
import { v4 as uuid } from 'uuid';
import { DateTime, Duration } from 'luxon';

export class ScheduleTaskBlockUseCase implements ScheduleTaskBlock {
    constructor(
        private readonly blockRepo: BlockRepo,
    ) { }

    async execute(userId: string, desc: ScheduleTaskBlockDesc): AsyncResult<string, TaskBlock> {
        const { startUtc, endUtc } = buildUtcInstants(desc);

        const block: TaskBlock = {
            id: uuid(),
            userId,
            category: 'task-block',
            taskId: desc.taskId,
            localDate: desc.startLocalDate,
            localTime: desc.startLocalTime,
            timezone: desc.timezone,
            duration: desc.duration,

            startUtc,
            endUtc,

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        try {
            const stored = await this.blockRepo.upsert(block);
            return ok(stored);
        } catch (error: unknown) {
            return nok(`Error storing new block: ${error}`);
        }
    }
}

export function buildUtcInstants({ startLocalDate, startLocalTime, timezone, duration, }: ScheduleBlockDesc) {
    const startZoned = DateTime.fromISO(`${startLocalDate}T${startLocalTime}`, { zone: timezone });
    if (!startZoned.isValid) throw new Error(`Invalid local date/time/timezone: ${startZoned.invalidReason}`);

    const dur = Duration.fromISO(duration);
    if (!dur.isValid) throw new Error(`Invalid ISO duration: ${duration}`);

    const endZoned = startZoned.plus(dur);

    const startUtc = startZoned.toUTC().toISO({ suppressMilliseconds: true });
    const endUtc   = endZoned.toUTC().toISO({ suppressMilliseconds: true });

    return { startUtc, endUtc };
}
