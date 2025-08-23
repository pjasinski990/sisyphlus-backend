import { DayPlanRepo } from '@/feature/day-plan/application/port/out/day-plan-repo';
import { DayPlan } from '../entity/day-plan';
import path from 'path';
import { promises as fs } from 'fs';

export class JsonDayPlanRepo implements DayPlanRepo {
    private readonly dbPath: string;

    constructor() {
        this.dbPath = path.resolve(process.cwd(), 'mockdb', 'day-plans.json');
    }

    async upsert(plan: DayPlan): Promise<DayPlan> {
        let plans = await this.readAll();
        if (plans.find(p => p.id === plan.id)) {
            plans = plans.map(p => p.id === plan.id ? plan : p);
        } else {
            plans.push(plan);
        }
        await this.writeAll(plans);
        return plan;
    }

    async getById(id: string): Promise<DayPlan | null> {
        const plans = await this.readAll();
        return plans.find(p => p.id === id) ?? null;
    }

    async getByLocalDate(localDate: string): Promise<DayPlan[] | null> {
        const plans = await this.readAll();
        return plans.filter(p => p.localDate === localDate);
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

    private async readAll(): Promise<DayPlan[]> {
        await this.ensureFileExists();
        const raw = await fs.readFile(this.dbPath, 'utf-8');
        try {
            return JSON.parse(raw) as DayPlan[];
        } catch {
            return [];
        }
    }

    private async writeAll(tasks: DayPlan[]): Promise<void> {
        await this.ensureFileExists();
        await fs.writeFile(this.dbPath, JSON.stringify(tasks, null, 2), 'utf-8');
    }
}
