import { Task } from '@/feature/task/entity/task';

export interface CreateTask {
    execute(task: Task): Promise<Result<Task, string>>;
}
