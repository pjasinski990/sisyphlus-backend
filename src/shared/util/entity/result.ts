export type ResultOk<T> = { ok: true; value: T }
export type ResultError<E> = { ok: false; error: E }

export type Result<E, T> = ResultError<E> | ResultOk<T>;

export type AsyncResult<E, T> = Promise<Result<E, T>>;

export function nok<E>(error: E): ResultError<E> {
    return { ok: false, error: error };
}

export function ok<T>(value: T): ResultOk<T> {
    return { ok: true, value: value };
}
