import { CreateTask } from '@/feature/task/application/ports/in/create-task';
import { CreateTaskUseCase } from '@/feature/task/application/use-case/create-task-use-case';
import { InMemoryTaskRepo } from '@/feature/task/infra/in-memory-task-repo';
import { Task } from '@/feature/task/entity/task';
import { Result } from '@/shared/util/entity/result';

export class TaskController {
    constructor(
        private readonly createTask: CreateTask,
    ) { }

    async handleCreateNewTask(task: Task): Promise<Result<Task, string>> {
        return await this.createTask.execute(task);
    }
}

const repo = new InMemoryTaskRepo();
const createTask = new CreateTaskUseCase(repo);

export const taskController = new TaskController(
    createTask
);
