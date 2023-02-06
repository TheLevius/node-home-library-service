import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { createHash } from 'node:crypto';
import { Result } from 'src/db/interfaces/result.interface';
import { Statuses } from 'src/db/interfaces/statuses.interface';
import { User } from 'src/db/interfaces/user.interface';
import { DbUsersTableService } from 'src/db/table.users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private dbUsersTableService: DbUsersTableService) {}

    public findAll = () => {
        const users = this.dbUsersTableService.findAll();
        return users.map((user) => {
            delete user.password;
            return user;
        });
    };

    public findOneById = (id: string): Result<Omit<User, 'password'>> =>
        this.trimPassword(this.dbUsersTableService.findOneById(id));

    public create = ({
        login,
        password,
    }: CreateUserDto): Result<Omit<User, 'password'>> => {
        const result = this.dbUsersTableService.create({
            login,
            password: this.hashPassword(password),
        });
        return this.trimPassword(result);
    };

    public update = (
        id: string,
        dto: UpdatePasswordDto
    ): Result<Omit<User, 'password'>> => {
        const existResult = this.dbUsersTableService.findOneById(id);
        if (existResult.status === Statuses.Failed) {
            throw new NotFoundException('User not found');
        }
        const {
            row: { password },
        } = existResult;
        if (this.hashPassword(dto.oldPassword) !== password) {
            throw new ForbiddenException(`oldPassowrd is wrong`);
        }
        const result = this.dbUsersTableService.update(id, {
            password: this.hashPassword(dto.newPassword),
        });
        return this.trimPassword(result);
    };

    public delete = (id: string): Result<Omit<User, 'password'>> =>
        this.trimPassword(this.dbUsersTableService.delete(id));

    private hashPassword = (password: string): string =>
        createHash('sha256').update(password).digest('hex');

    private trimPassword = (
        result: Result<User>
    ): Result<Omit<User, 'password'>> => {
        if (result.status === Statuses.Failed) {
            throw new NotFoundException('User not');
        }
        delete result.row.password;
        return result;
    };
}
