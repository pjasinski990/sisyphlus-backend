import { Request, Router } from 'express';
import { UnauthorizedError, ValidationError } from '@/shared/util/entity/http-error';
import { Task, TaskSchema } from '@/shared/task/entity/task';
import { taskController } from '@/shared/task/interface/controller/task-controller';

export const inboxRoutes = Router();

inboxRoutes.post('/', async (req, res) => {
    const task: Task = parseNewTaskRequest(req);

    const result = await taskController.handleCreateNewTask(task);
    if (!result.ok) {
        throw new ValidationError(`${result.error}`);
    }
    res.json(result.value);
});

inboxRoutes.get('/', async (req, res) => {
    const userId = req.authToken?.userId;
    if (!userId) {
        throw new UnauthorizedError();
    }

    const result = await taskController.handleGetInboxTasks(userId);
    if (!result.ok) {
        throw new ValidationError(`${result.error}`);
    }
    res.json(result.value);
});

inboxRoutes.get('/', async (req, res) => {
    const userId = req.authToken?.userId;
    if (!userId) throw new UnauthorizedError();

    const raw = req.query.ids;
    const ids =
        Array.isArray(raw) ? raw
            : typeof raw === 'string' && raw.length ? [raw]
                : [];

    if (ids.length === 0) {
        res.json([]);
        return;
    }

    // TODO proper type validation
    const unique = [...new Set(ids)] as string[];
    const result = await taskController.handleGetByIds(userId, unique);
    if (!result.ok) throw new ValidationError(`${result.error}`);
    res.json(result.value);
});

function parseNewTaskRequest(req: Request): Task {
    const parseResult = TaskSchema.safeParse(req.body);
    if (!parseResult.success) {
        throw new ValidationError('Invalid new task request', parseResult.error.flatten());
    }
    return parseResult.data;
}
