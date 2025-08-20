import { AsyncResult } from '@/shared/util/entity/result';
import { Task } from '@/shared/task/entity/task';

export interface GetInboxTasks {
    execute(userId: string): AsyncResult<string, Task[]>;
}
