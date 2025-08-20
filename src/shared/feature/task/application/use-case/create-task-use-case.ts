import { CreateTask } from '@/shared/feature/task/application/ports/in/create-task';
import { Task } from '@/shared/feature/task/entity/task';
import { TaskRepo } from '@/shared/feature/task/application/ports/out/task-repo';
import { AsyncResult, nok, ok } from '@/shared/util/entity/result';

export class CreateTaskUseCase implements CreateTask {
    constructor(
        private readonly repo: TaskRepo,
    ) { }

    async execute(task: Task): AsyncResult<string, Task> {
        const updatedTask: Task = {
            ...task,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        try {
            const res = await this.repo.upsert(updatedTask);
            return ok(res);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return nok(error.message);
            } else {
                return nok('Unknown error during insert');
            }
        }
    }
}
