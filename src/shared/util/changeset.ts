export type ChangesetItem =
    | {
    kind: 'collection';
    collection: string;
    upsert?: unknown[];
    remove?: string[];
}
    | {
    kind: 'event';
    type: string;
    payload: unknown;
};

export type Changeset = ChangesetItem[];
