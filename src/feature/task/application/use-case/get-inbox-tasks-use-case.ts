import { GetInboxTasks } from '@/feature/task/application/ports/in/get-inbox-tasks';
import { ok, Result } from '@/shared/util/entity/result';
import { TaskRepo } from '@/feature/task/application/ports/out/task-repo';
import { Task } from '@/feature/task/entity/task';

export class GetInboxTasksUseCase implements GetInboxTasks {
    constructor(
        private readonly repo: TaskRepo
    ) { }

    async execute(userId: string): Promise<Result<Task[], string>> {
        const tasks: Task[] = await this.repo.getByUserId(userId);
        const inboxTasks = tasks.filter(t => t.status === 'todo');
        return ok(inboxTasks);
    }
}
