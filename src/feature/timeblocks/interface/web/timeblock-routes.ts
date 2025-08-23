import { UnauthorizedError, ValidationError } from '@/shared/util/entity/http-error';
import { Router } from 'express';
import { ScheduleBlockDesc } from '@/feature/timeblocks/entity/schedule-block-description';
import { timeblockController } from '@/feature/timeblocks/interface/controller/timeblock-controller';

export const timeblockRoutes = Router();

timeblockRoutes.post('/', async (req, res) => {
    const userId = req.authToken?.userId;
    if (!userId) throw new UnauthorizedError();

    const payload = validatePostBlockPayload(req.body);
    const result = await timeblockController.handleScheduleTimeblock(userId, payload);

    if (!result.ok) throw new ValidationError(`${result.error}`);
    res.json(result.value);
});

timeblockRoutes.get('/:localDate', async (req, res) => {
    const userId = req.authToken?.userId;
    if (!userId) {
        throw new UnauthorizedError();
    }
    const localDate = req.params.localDate;
    const result = await timeblockController.handleGetByLocalDate(userId, localDate);
    if (!result.ok) {
        throw new ValidationError(`${result.error}`);
    }
    res.json(result.value);
});


timeblockRoutes.get('/', async (req, res) => {
    const userId = req.authToken?.userId;
    if (!userId) throw new UnauthorizedError();

    const raw = req.query.ids;
    const ids = Array.isArray(raw) ? raw : [raw];
    if (ids.length === 0) {
        res.json([]);
        return;
    }

    const unique = [...new Set(ids)] as string[];
    const result = await timeblockController.handleGetByIds(userId, unique);

    if (!result.ok) throw new ValidationError(`${result.error}`);
    res.json(result.value);
});


function validatePostBlockPayload(data: unknown): ScheduleBlockDesc {
    const parseResult = ScheduleBlockDesc.safeParse(data);
    if (!parseResult.success) {
        throw new ValidationError('Malformed payload', parseResult.error.flatten());
    }
    return parseResult.data;
}
