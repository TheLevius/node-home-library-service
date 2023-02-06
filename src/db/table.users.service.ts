import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateUserDto } from './dto/user/create-user.dto';
import { UpdateUserDto } from './dto/user/update-user.dto';
import { Result } from './interfaces/result.interface';
import { Statuses } from './interfaces/statuses.interface';
import { User, UserKeys } from './interfaces/user.interface';

@Injectable()
export class DbUsersTableService {
    private table: User[] = [];
    public findAll = (): User[] => this.table.map((row) => ({ ...row }));
    public findMany = ({
        key,
        equals,
    }: {
        key: UserKeys;
        equals: unknown;
    }): User[] => {
        return this.table.reduce((result: User[], user) => {
            if (user[key] === equals) result.push({ ...user });
            return result;
        }, []);
    };
    public findOneById = (id: string): Result<User> => {
        const index = this.table.findIndex((row: User) => row.id === id);
        if (index < 0) {
            return { status: Statuses.Failed };
        }
        return {
            status: Statuses.Ok,
            index,
            row: { ...this.table[index] },
        };
    };
    public create = (dto: CreateUserDto): Result<User> => {
        const currentDate = Date.now();
        const row: User = {
            id: randomUUID(),
            createdAt: currentDate,
            updatedAt: currentDate,
            version: 1,
            ...dto,
        };
        this.table.push({ ...row });
        return { row, status: Statuses.Ok };
    };
    public update = (id: string, dto: UpdateUserDto): Result<User> => {
        const result = this.findOneById(id);
        if (result.status === Statuses.Failed) {
            return result;
        }
        const { row, index } = result;
        row.version++;
        row.updatedAt = Date.now();
        this.table[index] = { ...row, ...dto };
        return { row: { ...this.table[index] }, status: Statuses.Ok };
    };
    public delete = (id: string): Result<User> => {
        const result = this.findOneById(id);
        if (result.status === Statuses.Failed) {
            throw new NotFoundException('User not found');
        }
        this.table = this.table.filter((row) => row.id !== id);
        return {
            row: result.row,
            status: Statuses.Ok,
        };
    };
}
