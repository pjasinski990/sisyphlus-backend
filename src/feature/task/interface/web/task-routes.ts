import { Request, Router } from 'express';
import { UnauthorizedError, ValidationError } from '@/shared/util/entity/http-error';
import { Task, TaskSchema } from '@/feature/task/entity/task';
import { taskController } from '@/feature/task/interface/controller/task-controller';

export const taskRoutes = Router();

taskRoutes.post('/', async (req, res) => {
    const task: Task = parseNewTaskRequest(req);

    const result = await taskController.handleCreateNewTask(task);
    if (!result.ok) {
        throw new ValidationError(`${result.error}`);
    }
    res.json(result.value);
});

taskRoutes.get('/', async (req, res) => {
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

function parseNewTaskRequest(req: Request): Task {
    const parseResult = TaskSchema.safeParse(req.body);
    if (!parseResult.success) {
        throw new ValidationError('Invalid new task request', parseResult.error.flatten());
    }
    return parseResult.data;
}
