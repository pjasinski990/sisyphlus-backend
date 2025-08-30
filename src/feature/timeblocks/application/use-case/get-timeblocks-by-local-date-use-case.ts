import { GetTimeblocksByLocalDate } from '@/feature/timeblocks/application/ports/in/get-timeblocks-by-local-date';
import { AsyncResult, ok } from '@/shared/util/entity/result';
import { Block } from '@/feature/timeblocks/entity/block';
import { BlockRepo } from '@/feature/timeblocks/application/ports/out/block-repo';

export class GetTimeblocksByLocalDateUseCase implements GetTimeblocksByLocalDate {
    constructor(
        private readonly repo: BlockRepo,
    ) { }

    async execute(userId: string, localDate: string): AsyncResult<string, Block[]> {
        const result = await this.repo.getByLocalDate(userId, localDate);
        return ok(result);
    }
}
