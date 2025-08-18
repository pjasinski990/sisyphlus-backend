import { z } from 'zod';
import { v4 as uuid } from 'uuid';

export const PlannedTaskStatusSchema = z.enum(['planned', 'completed', 'skipped']);

const YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/;

export const DayPlanEntrySchema = z.object({
    id: z.string().min(1),
    taskId: z.string().min(1),
    order: z.number().finite(),
    status: PlannedTaskStatusSchema,
    carryoverFrom: z.string().regex(YYYY_MM_DD).optional(),
});

export const DayPlanSchema = z.object({
    id: z.string().min(1),
    userId: z.string().min(1),
    localDate: z.string().regex(YYYY_MM_DD),
    keyTaskId: z.string().min(1).optional(),
    entries: z.array(DayPlanEntrySchema),

    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});

export type PlannedTaskStatus = z.infer<typeof PlannedTaskStatusSchema>;
export type DayPlanEntry = z.infer<typeof DayPlanEntrySchema>;
export type DayPlan = z.infer<typeof DayPlanSchema>;

export function buildEmptyDayPlan(localDate: string, userId: string): DayPlan {
    return {
        id: uuid(),
        userId,
        localDate,
        entries: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}
