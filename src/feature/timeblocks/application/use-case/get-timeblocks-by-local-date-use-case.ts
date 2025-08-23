import { GetTimeblocksByLocalDate } from '@/feature/timeblocks/application/ports/in/get-timeblocks-by-local-date';
import { AsyncResult, ok } from '@/shared/util/entity/result';
import { Timeblock } from '@/feature/timeblocks/entity/timeblock';
import { BlockRepo } from '@/feature/timeblocks/application/ports/out/block-repo';

export class GetTimeblocksByLocalDateUseCase implements GetTimeblocksByLocalDate {
    constructor(
        private readonly repo: BlockRepo,
    ) { }

    async execute(userId: string, localDate: string): AsyncResult<string, Timeblock[]> {
        const result = await this.repo.getByLocalDate(userId, localDate);
        return ok(result);
    }
}
