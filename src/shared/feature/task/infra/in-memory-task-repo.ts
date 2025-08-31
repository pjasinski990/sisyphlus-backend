import { TaskRepo } from '@/shared/feature/task/application/ports/out/task-repo';
import { Task } from '@/shared/feature/task/entity/task';

export class InMemoryTaskRepo implements TaskRepo {
    tasks: Task[] = [];

    async upsert(task: Task): Promise<Task> {
        if (this.tasks.find(s => s.id === task.id)) {
            this.tasks = this.tasks.map(s => s.id === task.id ? task : s);
        } else {
            this.tasks.push(task);
        }
        return task;
    }

    async getByUserId(userId: string): Promise<Task[]> {
        return this.tasks.filter(t => t.userId === userId);
    }

    async getById(userId: string, id: string): Promise<Task | null> {
        return this.tasks.find(t => t.id === id && t.userId === userId) ?? null;
    }
}
