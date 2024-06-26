import { DBSign } from './index.interface';

export interface User extends DBSign {
    login: string;
    password: string;
    version: number; // integer number, increments on update
    createdAt: number; // timestamp of creation
    updatedAt: number; // timestamp of last update
}

export type UserKeys = keyof User;
