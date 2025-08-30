import { UnauthorizedError, ValidationError } from '@/shared/util/entity/http-error';
import { Router } from 'express';
import { ScheduleBlockDesc } from '@/feature/timeblocks/entity/schedule-block-description';
import { timeblockController } from '@/feature/timeblocks/interface/controller/timeblock-controller';
import { UpdateBlockPayload, UpdateBlockPayloadSchema } from '@/feature/timeblocks/entity/block';

export const timeblockRoutes = Router();

timeblockRoutes.post('/', async (req, res) => {
    const userId = req.authToken?.userId;
    if (!userId) throw new UnauthorizedError();

    const payload = validatePostBlockPayload(req.body);
    const result = await timeblockController.handleScheduleTimeblock(userId, payload);

    if (!result.ok) throw new ValidationError(`${result.error}`);
    res.json(result.value);
});

timeblockRoutes.put('/', async (req, res) => {
    const userId = req.authToken?.userId;
    if (!userId) throw new UnauthorizedError();

    const payload = validateUpdateBlockPayload(req.body);
    const result = await timeblockController.handleUpdateTimeblock(userId, payload);

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

timeblockRoutes.delete('/:id', async (req, res) => {
    const userId = req.authToken?.userId;
    if (!userId) throw new UnauthorizedError();

    const blockId = req.params.id;
    if (!blockId) throw new ValidationError('Block ID is required');

    const result = await timeblockController.handleRemoveTimeblock(userId, blockId);

    if (!result.ok) throw new ValidationError(`${result.error}`);
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

function validateUpdateBlockPayload(data: unknown): UpdateBlockPayload {
    const parsed = UpdateBlockPayloadSchema.safeParse(data);
    if (!parsed.success) {
        throw new ValidationError('Malformed payload', parsed.error.flatten());
    }
    return parsed.data;
}
