import { Statuses } from './statuses.interface';

export type Result<T> = {
    index?: number;
} & ({ row: T; status: Statuses.Ok } | { status: Statuses.Failed });
