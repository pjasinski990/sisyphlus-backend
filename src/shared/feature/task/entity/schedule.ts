import { z } from 'zod';

const YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/;

export const ScheduleSchema = z
    .object({
        rrule: z.string(),
        timezone: z.string(),
        additionalDates: z.array(z.string().regex(YYYY_MM_DD)),
        excludedDates: z.array(z.string().regex(YYYY_MM_DD)),
        beginDate: z.string().regex(YYYY_MM_DD),
        untilDate: z.string().regex(YYYY_MM_DD).optional(),
    })
    .strict()
    .superRefine((val, ctx) => {
        if (val.untilDate && val.untilDate < val.beginDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'untilDate must be the same as or after beginDate',
                path: ['untilDate'],
            });
        }
        const hasDupes = (arr: string[]) => new Set(arr).size !== arr.length;
        if (hasDupes(val.additionalDates)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'additionalDates contains duplicates',
                path: ['additionalDates'],
            });
        }
        if (hasDupes(val.excludedDates)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'excludedDates contains duplicates',
                path: ['excludedDates'],
            });
        }
    });

export type Schedule = z.infer<typeof ScheduleSchema>;
