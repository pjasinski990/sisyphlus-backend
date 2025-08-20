import { Task } from '@/shared/task/entity/task';
import { AsyncResult } from '@/shared/util/entity/result';

export interface CreateTask {
    execute(task: Task): AsyncResult<string, Task>;
}
