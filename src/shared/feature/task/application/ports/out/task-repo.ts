import { Task } from '@/shared/feature/task/entity/task';

export interface TaskRepo {
    upsert(task: Task): Promise<Task>;
    getById(taskId: string): Promise<Task | null>;
    getByUserId(userId: string): Promise<Task[]>;
}
