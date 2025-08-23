import { GetDayPlan } from '@/feature/day-plan/application/port/in/get-day-plan';
import { DayPlan } from '@/feature/day-plan/entity/day-plan';
import { AsyncResult } from '@/shared/util/entity/result';
import { GetDayPlanUseCase } from '@/feature/day-plan/application/use-case/get-day-plan-use-case';
import { ScheduleTask } from '@/feature/day-plan/application/port/in/schedule-task';
import { ScheduleTaskUseCase } from '@/feature/day-plan/application/use-case/schedule-task-use-case';
import { JsonTaskRepo } from '@/shared/feature/task/infra/json-task-repo';
import { Changeset } from '@/shared/util/changeset';
import { JsonDayPlanRepo } from '@/feature/day-plan/infra/json-day-plan-repo';

export class DayPlanController {
    constructor(
        private readonly getDayPlan: GetDayPlan,
        private readonly scheduleTask: ScheduleTask,
    ) { }

    handleGetByLocalDate(localDate: string, userId: string): AsyncResult<string, DayPlan> {
        return this.getDayPlan.execute(localDate, userId);
    }

    handleScheduleTaskForDay(localDate: string, taskId: string, userId: string): AsyncResult<string, Changeset> {
        return this.scheduleTask.execute(localDate, taskId, userId);
    }
}

const dayPlanRepo = new JsonDayPlanRepo();
const taskRepo = new JsonTaskRepo();

const getDayPlan = new GetDayPlanUseCase(dayPlanRepo);
const scheduleTask = new ScheduleTaskUseCase(getDayPlan, taskRepo, dayPlanRepo);

export const dayPlanController = new DayPlanController(
    getDayPlan,
    scheduleTask,
);
