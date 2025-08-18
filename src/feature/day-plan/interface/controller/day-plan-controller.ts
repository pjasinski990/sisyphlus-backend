import { GetDayPlan } from '@/feature/day-plan/application/port/in/get-day-plan';
import { DayPlan } from '@/feature/day-plan/entity/day-plan';
import { Result } from '@/shared/util/entity/result';
import { GetDayPlanUseCase } from '@/feature/day-plan/application/use-case/get-day-plan-use-case';
import { InMemoryDayPlanRepo } from '@/feature/day-plan/infra/in-memory-day-plan-repo';

export class DayPlanController {
    constructor(
        private readonly getDayPlan: GetDayPlan
    ) { }

    handleGetDayPlan(localDate: string, userId: string): Promise<Result<DayPlan, string>> {
        return this.getDayPlan.execute(localDate, userId);
    }
}

const repo = new InMemoryDayPlanRepo();
const getDayPlan = new GetDayPlanUseCase(repo);

export const dayPlanController = new DayPlanController(
    getDayPlan
);
