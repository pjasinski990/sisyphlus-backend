import { Task } from '@/shared/task/entity/task';
import { Result } from '@/shared/util/entity/result';
import { GetInboxTasks } from '@/feature/inbox/application/ports/in/get-inbox-tasks';
import { GetInboxTasksUseCase } from '@/feature/inbox/application/use-case/get-inbox-tasks-use-case';
import { JsonTaskRepo } from '@/shared/task/infra/json-task-repo';

export class InboxController {
    constructor(
        private readonly getInboxTasks: GetInboxTasks,
    ) { }

    async handleGetInboxTasks(userId: string): Promise<Result<Task[], string>> {
        return await this.getInboxTasks.execute(userId);
    }
}

const taskRepo = new JsonTaskRepo();
const getInboxTasks = new GetInboxTasksUseCase(taskRepo);

export const inboxController = new InboxController(
    getInboxTasks,
);
