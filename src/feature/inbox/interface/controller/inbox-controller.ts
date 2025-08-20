import { Task } from '@/shared/feature/task/entity/task';
import { AsyncResult } from '@/shared/util/entity/result';
import { GetInboxTasks } from '@/feature/inbox/application/ports/in/get-inbox-tasks';
import { GetInboxTasksUseCase } from '@/feature/inbox/application/use-case/get-inbox-tasks-use-case';
import { JsonTaskRepo } from '@/shared/feature/task/infra/json-task-repo';

export class InboxController {
    constructor(
        private readonly getInboxTasks: GetInboxTasks,
    ) { }

    async handleGetInboxTasks(userId: string): AsyncResult<string, Task[]> {
        return await this.getInboxTasks.execute(userId);
    }
}

const taskRepo = new JsonTaskRepo();
const getInboxTasks = new GetInboxTasksUseCase(taskRepo);

export const inboxController = new InboxController(
    getInboxTasks,
);
