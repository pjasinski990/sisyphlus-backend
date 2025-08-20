import { UnauthorizedError, ValidationError } from '@/shared/util/entity/http-error';
import { taskController } from '@/shared/feature/task/interface/controller/task-controller';
import { Router } from 'express';

export const taskRoutes = Router();

taskRoutes.get('/', async (req, res) => {
    const userId = req.authToken?.userId;
    if (!userId) throw new UnauthorizedError();

    const raw = req.query.ids;
    const ids = Array.isArray(raw) ? raw : [raw];
    if (ids.length === 0) {
        res.json([]);
        return;
    }

    const unique = [...new Set(ids)] as string[];
    const result = await taskController.handleGetByIds(userId, unique);

    if (!result.ok) throw new ValidationError(`${result.error}`);
    res.json(result.value);
});

