import { Task } from '@/feature/task/entity/task';

export interface TaskRepo {
    upsert(task: Task): Promise<Task>;
    getByUserId(userId: string): Promise<Task[]>;
}
