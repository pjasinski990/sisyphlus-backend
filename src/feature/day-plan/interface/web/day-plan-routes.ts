import { Router, Request } from 'express';
import { UnauthorizedError, ValidationError } from '@/shared/util/entity/http-error';
import { dayPlanController } from '@/feature/day-plan/interface/controller/day-plan-controller';
import { z } from 'zod';

export const dayPlanRoutes = Router();

dayPlanRoutes.get('/:localDate', async (req, res) => {
    const userId = req.authToken?.userId;
    if (!userId) {
        throw new UnauthorizedError();
    }
    const localDate = req.params.localDate;
    const result = await dayPlanController.handleGetByLocalDate(localDate, userId);
    if (!result.ok) {
        throw new ValidationError(`${result.error}`);
    }
    res.json(result.value);
});

dayPlanRoutes.post('/:localDate/entries', async (req, res) => {
    const userId = req.authToken?.userId;
    if (!userId) {
        throw new UnauthorizedError();
    }
    const localDate = req.params.localDate;
    const { taskId } = parseScheduleTaskPayload(req);

    const result = await dayPlanController.handleScheduleTaskForDay(localDate, taskId, userId);
    if (!result.ok) {
        throw new ValidationError(`${result.error}`);
    }
    res.json(result.value);
});

const ScheduleTaskRequestSchema = z.object({
    taskId: z.string(),
});

type ScheduleTaskRequest = z.infer<typeof ScheduleTaskRequestSchema>;

function parseScheduleTaskPayload(req: Request): ScheduleTaskRequest {
    const result = ScheduleTaskRequestSchema.safeParse(req.body);
    if (result.success) {
        return result.data;
    }
    throw new ValidationError(`Invalid schedule task payload: ${result.error}`);
}
