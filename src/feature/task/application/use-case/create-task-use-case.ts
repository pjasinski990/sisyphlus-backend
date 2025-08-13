import { CreateTask } from '@/feature/task/application/ports/in/create-task';
import { Task } from '@/feature/task/entity/task';
import { TaskRepo } from '@/feature/task/application/ports/out/task-repo';
import { nok, ok, Result } from '@/shared/util/entity/result';

export class CreateTaskUseCase implements CreateTask {
    constructor(
        private readonly repo: TaskRepo,
    ) { }

    async execute(task: Task): Promise<Result<Task, string>> {
        try {
            const res = await this.repo.upsert(task);
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
