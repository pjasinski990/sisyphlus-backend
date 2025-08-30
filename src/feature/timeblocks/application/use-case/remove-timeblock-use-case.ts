import { RemoveTimeblock } from '@/feature/timeblocks/application/ports/in/remove-timeblock';
import { AsyncResult, nok, ok } from '@/shared/util/entity/result';
import { Block } from '@/feature/timeblocks/entity/block';
import { BlockRepo } from '@/feature/timeblocks/application/ports/out/block-repo';

export class RemoveTimeblockUseCase implements RemoveTimeblock {
    constructor(
        private readonly repo: BlockRepo,
    ) { }

    async execute(userId: string, blockId: string): AsyncResult<string, Block> {
        const block = await this.repo.getById(userId, blockId);
        await this.repo.removeById(userId, blockId);
        if (!block) {
            return nok('Block not found');
        }
        return ok(block);
    }
}
