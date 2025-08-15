import { z } from 'zod';
import { AnchorSchema, Anchor } from './anchor';
import { ScheduleSchema, Schedule } from './schedule';

export const TaskCategorySchema = z.enum(['simple', 'recurring']);
export const TaskStatusSchema = z.enum(['todo', 'done', 'archived']);
export const EnergyLevelSchema = z.enum(['low', 'medium', 'high']);
export const FlowStatusSchema = z.enum(['active', 'paused', 'archived']);

export const ISODateTime = z.string().datetime(); // ISO 8601 date-time
export const HHmm = z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Expected HH:mm');

export const BaseTaskSchema = z
    .object({
        id: z.string(),
        userId: z.string(),
        title: z.string(),
        category: TaskCategorySchema,
        description: z.string().optional(),
        dod: z.string().optional(),
        energy: EnergyLevelSchema,
        estimatedMin: z.number().int().nonnegative().optional(),
        spentMin: z.number().int().nonnegative().optional(),
        tags: z.array(z.string()),
        context: z.string().optional(),
        createdAt: ISODateTime,
        updatedAt: ISODateTime,
        parentId: z.string().optional(),
        anchor: AnchorSchema.optional(),
    })
    .strict();

export const SimpleTaskSchema = BaseTaskSchema.merge(
    z.object({
        category: z.literal('simple'),
        status: TaskStatusSchema,
        finishedAt: ISODateTime.optional(),
    }).strict()
);

export const RecurringTaskSchema = BaseTaskSchema.merge(
    z.object({
        category: z.literal('recurring'),
        status: FlowStatusSchema,
        schedule: ScheduleSchema,
        defaultDurationMin: z.number().int().nonnegative().optional(),
        preferredWindow: z
            .object({
                from: HHmm,
                to: HHmm,
            })
            .strict()
            .optional(),
    }).strict()
);

export const TaskSchema = z.discriminatedUnion('category', [
    SimpleTaskSchema,
    RecurringTaskSchema,
]);

export type TaskCategory = z.infer<typeof TaskCategorySchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type EnergyLevel = z.infer<typeof EnergyLevelSchema>;
export type FlowStatus = z.infer<typeof FlowStatusSchema>;

export type BaseTask = z.infer<typeof BaseTaskSchema>;
export type SimpleTask = z.infer<typeof SimpleTaskSchema>;
export type RecurringTask = z.infer<typeof RecurringTaskSchema>;
export type Task = z.infer<typeof TaskSchema>;

export type { Anchor, Schedule };
