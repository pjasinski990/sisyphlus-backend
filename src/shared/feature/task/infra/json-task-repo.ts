import { TaskRepo } from '@/shared/feature/task/application/ports/out/task-repo';
import { Task } from '@/shared/feature/task/entity/task';
import path from 'path';
import { promises as fs } from 'fs';

export class JsonTaskRepo implements TaskRepo {
    private readonly dbPath: string;

    constructor() {
        this.dbPath = path.resolve(process.cwd(), 'mockdb', 'tasks.json');
    }

    async upsert(task: Task): Promise<Task> {
        const tasks = await this.readAll();
        const idx = tasks.findIndex(m => m.id === task.id);
        if (idx !== -1) {
            tasks[idx] = task;
        } else {
            tasks.push(task);
        }
        await this.writeAll(tasks);
        return task;
    }

    async getByUserId(userId: string): Promise<Task[]> {
        const tasks = await this.readAll();
        return tasks.filter(t => t.userId === userId);
    }

    async getById(userId: string, id: string): Promise<Task | null> {
        const tasks = await this.readAll();
        return tasks.find(t => t.id === id && t.userId === userId) ?? null;
    }

    private async ensureFileExists() {
        const dir = path.dirname(this.dbPath);
        await fs.mkdir(dir, { recursive: true });
        try {
            await fs.access(this.dbPath);
        } catch {
            await fs.writeFile(this.dbPath, '[]', 'utf-8');
        }
    }

    private async readAll(): Promise<Task[]> {
        await this.ensureFileExists();
        const raw = await fs.readFile(this.dbPath, 'utf-8');
        try {
            return JSON.parse(raw) as Task[];
        } catch {
            return [];
        }
    }

    private async writeAll(tasks: Task[]): Promise<void> {
        await this.ensureFileExists();
        await fs.writeFile(this.dbPath, JSON.stringify(tasks, null, 2), 'utf-8');
    }
}
