import { DayPlan } from '@/feature/day-plan/entity/day-plan';

export interface DayPlanRepo {
    upsert(dayPlan: DayPlan): Promise<DayPlan>;
    getById(id: string): Promise<DayPlan | null>;
    getByLocalDate(localDate: string): Promise<DayPlan[] | null>;
}
