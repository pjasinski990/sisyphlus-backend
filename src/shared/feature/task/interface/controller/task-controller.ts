import { CreateTask } from '@/shared/feature/task/application/ports/in/create-task';
import { CreateTaskUseCase } from '@/shared/feature/task/application/use-case/create-task-use-case';
import { Task } from '@/shared/feature/task/entity/task';
import { AsyncResult, ok } from '@/shared/util/entity/result';
import { JsonTaskRepo } from '@/shared/feature/task/infra/json-task-repo';
import { TaskRepo } from '@/shared/feature/task/application/ports/out/task-repo';
import { logger } from '@/shared/feature/logging/interface/controller/logging-controller';

export class TaskController {
    constructor(
        private readonly taskRepo: TaskRepo,
        private readonly createTask: CreateTask,
    ) { }

    async handleCreateNewTask(task: Task): AsyncResult<string, Task> {
        return this.createTask.execute(task);
    }

    async handleGetByIds(userId: string, ids: string[]): AsyncResult<string, Task[]> {
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
