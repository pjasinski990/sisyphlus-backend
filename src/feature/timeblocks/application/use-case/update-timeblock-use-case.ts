import { UpdateTimeblock } from '@/feature/timeblocks/application/ports/in/update-timeblock';
import { Block, UpdateBlockPayload } from '@/feature/timeblocks/entity/block';
import { AsyncResult, nok, ok } from '@/shared/util/entity/result';
import { BlockRepo } from '@/feature/timeblocks/application/ports/out/block-repo';
import { buildUtcInstants } from '@/feature/timeblocks/application/use-case/schedule-task-block-use-case';

export class UpdateTimeblockUseCase implements UpdateTimeblock {
    constructor(
        private readonly repo: BlockRepo,
    ) { }

    async execute(userId: string, patch: UpdateBlockPayload): AsyncResult<string, Block> {
        const current = await this.repo.getById(userId, patch.id);
        if (!current) {
            return nok('No such block');
        }

        const updated: Block = {
            ...current,
            ...patch,
        };

        if (patch.localDate || patch.localTime || patch.timezone || patch.duration) {
            const instants = buildUtcInstants({
                startLocalDate: updated.localDate,
                startLocalTime: updated.localTime,
                timezone: updated.timezone,
                duration: updated.duration
            });
            updated.startUtc = instants.startUtc;
            updated.endUtc = instants.endUtc;
        }

        updated.updatedAt = new Date().toISOString();

        const saved = await this.repo.upsert(updated);
        return ok(saved);
    }
}
