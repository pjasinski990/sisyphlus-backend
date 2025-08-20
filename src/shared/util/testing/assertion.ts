import { Result, ResultError, ResultOk } from '@/shared/util/entity/result';
import { expect } from 'vitest';

export function expectResultOk<T>(result: Result<unknown, T>) : asserts result is ResultOk<T> {
    expect(result.ok).toBe(true);
}

export function expectResultError<E>(result: Result<E, unknown>) : asserts result is ResultError<E> {
    expect(result.ok).toBe(false);
}
