import { ScheduleTask } from '../port/in/schedule-task';
import { DayPlan, DayPlanEntry } from '@/feature/day-plan/entity/day-plan';
import { AsyncResult, nok, ok } from '@/shared/util/entity/result';
import { TaskRepo } from '@/shared/feature/task/application/ports/out/task-repo';
import { GetDayPlan } from '@/feature/day-plan/application/port/in/get-day-plan';
import { Task } from '@/shared/feature/task/entity/task';
import { v4 as uuid } from 'uuid';
import { DayPlanRepo } from '@/feature/day-plan/application/port/out/day-plan-repo';
import { Changeset } from '@/shared/util/changeset';

export class ScheduleTaskUseCase implements ScheduleTask {
    constructor(
        private readonly getDayPlan: GetDayPlan,
        private readonly taskRepo: TaskRepo,
        private readonly dayPlanRepo: DayPlanRepo,
    ) { }

    async execute(localDate: string, taskId: string, userId: string): AsyncResult<string, Changeset> {
        const task = await this.taskRepo.getById(taskId);
        if (!task) {
            return nok('There is no such task.');
        } else if (task.category === 'recurring') {
            return nok('Invalid task type for this operation.');
        } else if (task.plannedFor) {
            return nok(`Task is already planned for ${task.plannedFor}`);
        }

        const planResult = await this.getDayPlan.execute(localDate, userId);
        if (!planResult.ok) {
            return nok(planResult.error);
        }

        const plan = planResult.value;
        const newEntry = buildPlanEntry(task, plan);

        const updated = { ...plan, entries: [ ...plan.entries, newEntry ]};
        await this.dayPlanRepo.upsert(updated);
        await this.taskRepo.upsert({
            ...task,
            plannedFor: localDate,
            updatedAt: new Date().toISOString()
        });

        const changeset: Changeset = [
            {
                kind: 'collection',
                collection: 'task',
                upsert: [task]
            },
            {
                kind: 'collection',
                collection: 'day-plan',
                upsert: [updated]
            }
        ];

        return ok(changeset);
    }
}

function buildPlanEntry(task: Task, plan: DayPlan): DayPlanEntry {
    const maxOrderEntry = plan.entries.reduce(
        (max, entry) => (entry.order > max.order ? entry : max),
        { order: -10 } as DayPlanEntry
    );

    return {
        id: uuid(),
        taskId: task.id,
        status: 'planned',
        order: maxOrderEntry.order + 10,
    };
}
