import { z } from 'zod';

export const AnchorTypeSchema = z.enum(['task', 'tag']);
export const AnchorCategorySchema = z.enum(['after', 'before']);

export const BaseAnchorSchema = z
    .object({
        type: AnchorTypeSchema,
        anchorCategory: AnchorCategorySchema,
        timeOffsetMin: z.number().int().min(0),
    })
    .strict();

export const TaskAnchorSchema = BaseAnchorSchema.merge(
    z
        .object({
            type: z.literal('task'),
            taskId: z.string(),
        })
        .strict()
);

export const TagAnchorSchema = BaseAnchorSchema.merge(
    z
        .object({
            type: z.literal('tag'),
            tag: z.string(),
        })
        .strict()
);

export const AnchorSchema = z.discriminatedUnion('type', [
    TaskAnchorSchema,
    TagAnchorSchema,
]);

export type AnchorType = z.infer<typeof AnchorTypeSchema>;
export type AnchorCategory = z.infer<typeof AnchorCategorySchema>;
export type BaseAnchor = z.infer<typeof BaseAnchorSchema>;
export type TaskAnchor = z.infer<typeof TaskAnchorSchema>;
export type TagAnchor = z.infer<typeof TagAnchorSchema>;
export type Anchor = z.infer<typeof AnchorSchema>;
