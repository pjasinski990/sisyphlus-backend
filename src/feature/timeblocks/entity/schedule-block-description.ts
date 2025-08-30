import { z } from 'zod';
import { IANATimezone, ISODate, ISODuration } from '@/feature/timeblocks/entity/block';
import { HHmm } from '@/shared/feature/task/entity/task';

export const ScheduleBlockBaseDesc = z.object({
    startLocalDate: ISODate,
    startLocalTime: HHmm,
    duration: ISODuration,
    timezone: IANATimezone,
});

export const ScheduleTaskBlockDesc = ScheduleBlockBaseDesc.extend({
    taskId: z.string(),
    tag: z.never().optional(),
});

export const ScheduleTagBlockDesc = ScheduleBlockBaseDesc.extend({
    taskId: z.never().optional(),
    tag: z.string(),
});

export const ScheduleBlockDesc = z.union([
    ScheduleTaskBlockDesc,
    ScheduleTagBlockDesc,
]);

export type ScheduleBlockBaseDesc = z.infer<typeof ScheduleBlockBaseDesc>;
export type ScheduleTaskBlockDesc = z.infer<typeof ScheduleTaskBlockDesc>;
export type ScheduleTagBlockDesc = z.infer<typeof ScheduleTagBlockDesc>;
export type ScheduleBlockDesc = z.infer<typeof ScheduleBlockDesc>;
