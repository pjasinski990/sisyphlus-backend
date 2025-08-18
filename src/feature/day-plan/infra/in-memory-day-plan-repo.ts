import { DayPlanRepo } from '@/feature/day-plan/application/port/out/day-plan-repo';
import { DayPlan } from '../entity/day-plan';

export class InMemoryDayPlanRepo implements DayPlanRepo {
    plans: DayPlan[] = [];

    async upsert(plan: DayPlan): Promise<DayPlan> {
        if (this.plans.find(p => p.id === plan.id)) {
            this.plans = this.plans.map(p => p.id === plan.id ? plan : p);
        } else {
            this.plans.push(plan);
        }
        return plan;
    }

    async getById(id: string): Promise<DayPlan | null> {
        return this.plans.find(p => p.id === id) ?? null;
    }

    async getByLocalDate(localDate: string): Promise<DayPlan[] | null> {
        return this.plans.filter(p => p.localDate === localDate);
    }
}
