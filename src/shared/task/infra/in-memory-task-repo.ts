import { TaskRepo } from '@/shared/task/application/ports/out/task-repo';
import { Task } from '@/shared/task/entity/task';

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
}
