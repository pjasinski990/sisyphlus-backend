import { Router } from 'express';
import { UnauthorizedError, ValidationError } from '@/shared/util/entity/http-error';
import { dayPlanController } from '@/feature/day-plan/interface/controller/day-plan-controller';

export const dayPlanRoutes = Router();

dayPlanRoutes.get('/:localDate', async (req, res) => {
    const userId = req.authToken?.userId;
    if (!userId) {
        throw new UnauthorizedError();
    }
    const localDate = '2025-08-18';

    const result = await dayPlanController.handleGetDayPlan(localDate, userId);
    if (!result.ok) {
        throw new ValidationError(`${result.error}`);
    }
    res.json(result.value);
});
