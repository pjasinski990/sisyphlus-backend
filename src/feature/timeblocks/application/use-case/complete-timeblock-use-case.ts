import {
    BlockCompletedResponse,
    CompleteTimeblock,
} from '@/feature/timeblocks/application/ports/in/complete-timeblock';
import { AsyncResult, ok, nok } from '@/shared/util/entity/result';
import { BlockRepo } from '@/feature/timeblocks/application/ports/out/block-repo';
import { Block } from '@/feature/timeblocks/entity/block';
import { TaskRepo } from '@/shared/feature/task/application/ports/out/task-repo';
import { Task } from '@/shared/feature/task/entity/task';

export class CompleteTimeblockUseCase implements CompleteTimeblock {
    constructor(
        private readonly blockRepo: BlockRepo,
        private readonly taskRepo: TaskRepo,
    ) {}

    async execute(
        userId: string,
        blockId: string,
        isTaskDone: boolean,
        note?: string,
    ): AsyncResult<string, BlockCompletedResponse> {
        const block = await this.blockRepo.getById(userId, blockId);
        if (!block) return nok('Block not found');

        const taskId = getTaskIdForBlock(block);

        const cascade = await cascadeTaskCompletion({
            userId,
            taskId,
            isTaskDone,
            taskRepo: this.taskRepo,
        });

        const updatedBlock = await completeBlock({
            block,
            note,
            blockRepo: this.blockRepo,
        });

        return ok({
            block: updatedBlock,
            task: cascade.task,
            cascade: {
                attempted: cascade.attempted,
                completed: cascade.completed,
                reason: cascade.reason,
            },
        });
    }
}

function getTaskIdForBlock(block: Block): string | null {
    if (block.category === 'task-block') return block.taskId ?? null;
    return block.resolvedTaskId ?? null;
}

function nowIso(): string {
    return new Date().toISOString();
}

async function completeBlock(args: {
    block: Block;
    note?: string;
    blockRepo: BlockRepo;
}): Promise<Block> {
    const { block, note, blockRepo } = args;
    const ts = nowIso();

    const updated: Block = {
        ...block,
        progressNote: note ?? block.progressNote,
        completedAt: ts,
        updatedAt: ts,
    };

    return blockRepo.upsert(updated);
}

async function cascadeTaskCompletion(args: {
    userId: string;
    taskId: string | null;
    isTaskDone: boolean;
    taskRepo: TaskRepo;
}): Promise<{ task: Task | null; attempted: boolean; completed: boolean; reason: string }> {
    const { userId, taskId, isTaskDone, taskRepo } = args;

    if (!isTaskDone) {
        return { task: null, attempted: false, completed: false, reason: 'task completion not requested' };
    }

    if (!taskId) {
        return { task: null, attempted: false, completed: false, reason: 'no task assigned to this block' };
    }

    const current = await taskRepo.getById(userId, taskId);
    if (!current) {
        return { task: null, attempted: true, completed: false, reason: 'task not found' };
    }

    if (current.category === 'recurring') {
        return { task: null, attempted: true, completed: false, reason: 'recurring task cannot be completed' };
    }

    if (current.status === 'done') {
        return { task: current, attempted: true, completed: true, reason: 'already completed' };
    }

    const updated: Task = {
        ...current,
        status: 'done',
        updatedAt: nowIso(),
    };

    const saved = await taskRepo.upsert(updated);
    return { task: saved, attempted: true, completed: true, reason: 'ok' };
}
