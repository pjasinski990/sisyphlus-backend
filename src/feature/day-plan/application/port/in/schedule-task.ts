import { AsyncResult } from '@/shared/util/entity/result';
import { Changeset } from '@/shared/util/changeset';

export interface ScheduleTask {
    execute(localDate: string, taskId: string, userId: string): AsyncResult<string, Changeset>;
}
