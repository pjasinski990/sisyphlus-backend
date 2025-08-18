import { CreateTask } from '@/feature/inbox/application/ports/in/create-task';
import { CreateTaskUseCase } from '@/feature/inbox/application/use-case/create-task-use-case';
import { InMemoryTaskRepo } from '@/shared/task/infra/in-memory-task-repo';
import { Task } from '@/shared/task/entity/task';
import { Result } from '@/shared/util/entity/result';
import { GetInboxTasks } from '@/feature/inbox/application/ports/in/get-inbox-tasks';
import { GetInboxTasksUseCase } from '@/feature/inbox/application/use-case/get-inbox-tasks-use-case';

export class TaskController {
    constructor(
        private readonly createTask: CreateTask,
        private readonly getInboxTasks: GetInboxTasks,
    ) { }

    async handleCreateNewTask(task: Task): Promise<Result<Task, string>> {
        return await this.createTask.execute(task);
    }

    async handleGetInboxTasks(userId: string): Promise<Result<Task[], string>> {
        return await this.getInboxTasks.execute(userId);
    }
}

const repo = new InMemoryTaskRepo();
const createTask = new CreateTaskUseCase(repo);
const getInboxTasks = new GetInboxTasksUseCase(repo);

export const taskController = new TaskController(
    createTask,
    getInboxTasks,
);
