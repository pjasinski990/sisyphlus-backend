import { CreateTask } from '@/shared/task/application/ports/in/create-task';
import { CreateTaskUseCase } from '@/shared/task/application/use-case/create-task-use-case';
import { Task } from '@/shared/task/entity/task';
import { ok, Result } from '@/shared/util/entity/result';
import { GetInboxTasksUseCase } from '@/feature/inbox/application/use-case/get-inbox-tasks-use-case';
import { JsonTaskRepo } from '@/shared/task/infra/json-task-repo';
import { TaskRepo } from '@/shared/task/application/ports/out/task-repo';
import { logger } from '@/shared/feature/logging/interface/controller/logging-controller';

export class TaskController {
    constructor(
        private readonly taskRepo: TaskRepo,
        private readonly createTask: CreateTask,
    ) { }

    async handleCreateNewTask(task: Task): Promise<Result<Task, string>> {
        return await this.createTask.execute(task);
    }

    async handleGetByIds(userId: string, ids: string[]): Promise<Result<Task[], string>> {
        logger.warn(`Retrieving by ids: ${ids}`);
        // TODO move to usecase
        const tasks = await this.taskRepo.getByUserId(userId);
        const filtered = tasks.filter(task => ids.includes(task.id));
        return ok(filtered);
    }
}

const taskRepo = new JsonTaskRepo();
const createTask = new CreateTaskUseCase(taskRepo);

export const taskController = new TaskController(
    taskRepo,
    createTask,
);
