import { GetInboxTasks } from '@/feature/inbox/application/ports/in/get-inbox-tasks';
import { ok, Result } from '@/shared/util/entity/result';
import { TaskRepo } from '@/shared/task/application/ports/out/task-repo';
import { Task } from '@/shared/task/entity/task';

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
