import { GetDayPlan } from '@/feature/day-plan/application/port/in/get-day-plan';
import { buildEmptyDayPlan, DayPlan, DayPlanEntry } from '@/feature/day-plan/entity/day-plan';
import { AsyncResult, nok, ok } from '@/shared/util/entity/result';
import { DayPlanRepo } from '@/feature/day-plan/application/port/out/day-plan-repo';
import { Task } from '@/shared/feature/task/entity/task';
import { v4 as uuid } from 'uuid';

export class GetDayPlanUseCase implements GetDayPlan {
    constructor(
        private readonly repo: DayPlanRepo
    ) { }

    async execute(localDate: string, userId: string): AsyncResult<string, DayPlan> {
        const retrieved = await this.repo.getByLocalDate(localDate);
        const forUser = retrieved?.filter(plan => plan.userId === userId);

        if (forUser?.length === 0) {
            const newPlan = await buildNewDayPlan(localDate, userId);
            await this.repo.upsert(newPlan);
            return ok(newPlan);
        }

        if (forUser?.length === 1) {
            // TODO refresh updated recurring tasks
            return ok(forUser[0]);
        }

        else return nok('More than one plan for this day exists! Not supported yet.');
    }
}

async function buildNewDayPlan(localDate: string, userId: string): Promise<DayPlan> {
    const empty = buildEmptyDayPlan(localDate, userId);
    const workflows = await discoverWorkflowsLandingAt(localDate);
    return populate(empty, workflows);
}

async function discoverWorkflowsLandingAt(localDate: string): Promise<Task[]> {
    // TODO implement load recurring
    return [];
}

async function populate(dayPlan: DayPlan, tasks: Task[]): Promise<DayPlan> {
    const unordered = tasks.map(t => toPlanEntry(t));
    const entries = order(unordered);
    return { ...dayPlan, entries };
}

function toPlanEntry(task: Task): DayPlanEntry {
    return {
        id: uuid(),
        taskId: task.id,
        order: 0,
        status: 'planned',
    };
}

function order(entries: DayPlanEntry[]): DayPlanEntry[] {
    return entries.map((entry, i) => ({
        ...entry,
        order: i * 10,
    }));
}
