import { AsyncResult } from '@/shared/util/entity/result';
import { Block } from '@/feature/timeblocks/entity/block';
import { Task } from '@/shared/feature/task/entity/task';

export interface CompleteTimeblock {
    execute(userId: string, blockId: string, isTaskDone: boolean, completionNote?: string): AsyncResult<string, BlockCompletedResponse>;
}

export interface BlockCompletedResponse {
    block: Block;
    task: Task | null;
    cascade: {
        attempted: boolean;
        completed: boolean;
        reason: string;
    }
}
