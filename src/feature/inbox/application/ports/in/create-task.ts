import { Task } from '@/shared/task/entity/task';
import { Result } from '@/shared/util/entity/result';

export interface CreateTask {
    execute(task: Task): Promise<Result<Task, string>>;
}
