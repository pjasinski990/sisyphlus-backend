import { AsyncResult, ok } from '@/shared/util/entity/result';
import { Timeblock } from '@/feature/timeblocks/entity/timeblock';
import { BlockRepo } from '@/feature/timeblocks/application/ports/out/block-repo';
import { GetTimeblocksByIds } from '@/feature/timeblocks/application/ports/in/get-timeblocks-by-ids';

export class GetTimeblocksByIdsUseCase implements GetTimeblocksByIds {
    constructor(
        private readonly repo: BlockRepo,
    ) { }

    async execute(userId: string, ids: string[]): AsyncResult<string, Timeblock[]> {
        const result = await this.repo.getByIds(userId, ids);
        return ok(result);
    }
}
