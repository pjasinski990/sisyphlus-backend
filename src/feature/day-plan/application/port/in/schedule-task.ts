import { Result } from '@/shared/util/entity/result';
import { DayPlan } from '@/feature/day-plan/entity/day-plan';

export interface ScheduleTask {
    execute(localDate: string, taskId: string, userId: string): Promise<Result<DayPlan, string>>;
}
