import { z } from 'zod';

export const YYYYMMDD = z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, 'Expected YYYY-MM-DD');

export const ScheduleSchema = z
    .object({
        rrule: z.string(),
        timezone: z.string(),
        additionalDates: z.array(YYYYMMDD),
        excludedDates: z.array(YYYYMMDD),
        beginDate: YYYYMMDD,
        untilDate: YYYYMMDD.optional(),
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
