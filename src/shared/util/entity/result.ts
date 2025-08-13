export type ResultOk<T> = { ok: true; value: T }
export type ResultError<E> = { ok: false; error: E }

// TODO swap the order
// TODO add async result
export type Result<T, E> = ResultOk<T> | ResultError<E>

export function ok<T>(value: T): ResultOk<T> {
    return { ok: true, value: value };
}

export function nok<E>(error: E): ResultError<E> {
    return { ok: false, error: error };
}
