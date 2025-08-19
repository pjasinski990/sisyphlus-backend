import { GetDayPlan } from '@/feature/day-plan/application/port/in/get-day-plan';
import { DayPlan } from '@/feature/day-plan/entity/day-plan';
import { Result } from '@/shared/util/entity/result';
import { GetDayPlanUseCase } from '@/feature/day-plan/application/use-case/get-day-plan-use-case';
import { InMemoryDayPlanRepo } from '@/feature/day-plan/infra/in-memory-day-plan-repo';
import { inMemoryTaskRepo } from '@/shared/task/infra/in-memory-task-repo';
import { ScheduleTask } from '@/feature/day-plan/application/port/in/schedule-task';
import { ScheduleTaskUseCase } from '@/feature/day-plan/application/use-case/schedule-task-use-case';

export class DayPlanController {
    constructor(
        private readonly getDayPlan: GetDayPlan,
        private readonly scheduleTask: ScheduleTask,
    ) { }

    handleGetDayPlan(localDate: string, userId: string): Promise<Result<DayPlan, string>> {
        return this.getDayPlan.execute(localDate, userId);
    }

    handleScheduleTaskForDay(localDate: string, taskId: string, userId: string): Promise<Result<DayPlan, string>> {
        return this.scheduleTask.execute(localDate, taskId, userId);
    }
}

const dayPlanRepo = new InMemoryDayPlanRepo();

const getDayPlan = new GetDayPlanUseCase(dayPlanRepo);
const scheduleTask = new ScheduleTaskUseCase(getDayPlan, inMemoryTaskRepo, dayPlanRepo);

export const dayPlanController = new DayPlanController(
    getDayPlan,
    scheduleTask,
);
