import { z } from 'zod';

export const ISODateTime = z.string().datetime();
export const HHmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Expected HH:mm');
export const ISODate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');
export const ISOInstantUTC = ISODateTime.refine(
    (s) => s.endsWith('Z'),
    "Expected UTC instant with 'Z' suffix"
);
export const IANATimezone = z .string().regex(/^[^\s\/]+\/\S+$/, 'Expected timezone (eg. Europe/Warsaw)');
export const ISODuration = z.string().regex(/^P(?!$)[0-9YMWDTHS.,:+-]+$/, 'Expected ISO-8601 duration (e.g., PT1H30M)');

export const BaseBlockSchema = z.object({
    id: z.string(),
    category: z.enum(['task-block', 'tag-block']),
    userId: z.string(),

    localDate: ISODate,
    localTime: HHmm,
    timezone: IANATimezone,

    startUtc: ISOInstantUTC,
    duration: ISODuration,
    endUtc: ISOInstantUTC,

    cancelledAt: ISOInstantUTC.optional(),
    completedAt: ISOInstantUTC.optional(),

    progressNote: z.string().optional(),
    artifactUrl: z.string().url().optional(),

    recurrenceInstanceId: z.string().optional(),

    createdAt: ISOInstantUTC.optional(),
    updatedAt: ISOInstantUTC.optional(),
});

export const TaskBlockSchema = BaseBlockSchema.extend({
    category: z.literal('task-block'),
    taskId: z.string(),
    tag: z.never().optional(),
});

export const TagBlockSchema = BaseBlockSchema.extend({
    category: z.literal('tag-block'),
    tag: z.string(),
    taskId: z.never().optional(),
    resolvedTaskId: z.string().optional(),
});

export const UpdateBlockPayloadSchema = z.object({
    id: z.string().min(1),
    localDate: ISODate.optional(),
    localTime: HHmm.optional(),
    timezone: IANATimezone.optional(),
    duration: ISODuration.optional(),
    progressNote: z.string().optional(),
    artifactUrl: z.string().url().optional(),
    cancelledAt: ISOInstantUTC.optional(),
    completedAt: ISOInstantUTC.optional(),
}).refine(
    (p) =>
        !!(p.localDate || p.localTime || p.timezone || p.duration || p.progressNote || p.artifactUrl || p.cancelledAt || p.completedAt),
    { message: 'Empty patch' }
);

export const BlockSchema = z.discriminatedUnion('category', [
    TaskBlockSchema,
    TagBlockSchema,
]);

export type BaseBlock = z.infer<typeof BaseBlockSchema>;
export type TaskBlock = z.infer<typeof TaskBlockSchema>;
export type TagBlock = z.infer<typeof TagBlockSchema>;
export type Block = z.infer<typeof BlockSchema>;
export type UpdateBlockPayload = z.infer<typeof UpdateBlockPayloadSchema>;
