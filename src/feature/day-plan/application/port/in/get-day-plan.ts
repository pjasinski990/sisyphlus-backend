import { AsyncResult } from '@/shared/util/entity/result';
import { DayPlan } from '@/feature/day-plan/entity/day-plan';

export interface GetDayPlan {
    execute(localDate: string, userId: string): AsyncResult<string, DayPlan>;
}
