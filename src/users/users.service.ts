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
import { User as UserPrisma } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class UsersService {
    constructor(
        private dbUsersTableService: DbUsersTableService,
        private prisma: PrismaService
    ) {}

    public findAll = async () => {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                login: true,
                version: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return users.map((user) => ({
            ...user,
            createdAt: new Date(user.createdAt).valueOf(),
            updatedAt: new Date(user.updatedAt).valueOf(),
        }));
    };

    public findOneById = async (
        id: string
    ): Promise<Omit<User, 'password'>> => {
        // this.trimPassword(this.dbUsersTableService.findOneById(id));
        try {
            const result = await this.prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    login: true,
                    version: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return {
                ...result,
                createdAt: new Date(result.createdAt).valueOf(),
                updatedAt: new Date(result.updatedAt).valueOf(),
            };
        } catch (err) {
            console.error(err);
            throw new NotFoundException(`User with id: ${id} not found`);
        }
    };

    public create = async ({
        login,
        password,
    }: CreateUserDto): Promise<{
        id: string;
        login: string;
        version: number;
        createdAt: number;
        updatedAt: number;
    }> => {
        const result = await this.prisma.user.create({
            data: {
                login,
                password: this.hashPassword(password),
            },
            select: {
                id: true,
                login: true,
                version: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return {
            ...result,
            createdAt: new Date(result.createdAt).valueOf(),
            updatedAt: new Date(result.updatedAt).valueOf(),
        };
        // const result = this.dbUsersTableService.create({
        //     login,
        //     password: this.hashPassword(password),
        // });
        // return this.trimmer(result);
        // return this.trimPassword(result);
    };

    public update = async (
        id: string,
        dto: UpdatePasswordDto
    ): Promise<{
        id: string;
        login: string;
        version: number;
        createdAt: number;
        updatedAt: number;
    }> => {
        let user: UserPrisma;
        try {
            user = await this.prisma.user.findUniqueOrThrow({ where: { id } });
        } catch (err) {
            throw new NotFoundException(`User with id: ${id} not found`);
        }
        if (this.hashPassword(dto.oldPassword) !== user?.password) {
            throw new ForbiddenException(`oldPassword is wrong`);
        }

        try {
            const result = await this.prisma.user.update({
                where: { id },
                data: {
                    password: this.hashPassword(dto.newPassword),
                    version: ++user.version,
                },
                select: {
                    id: true,
                    login: true,
                    version: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return {
                ...result,
                createdAt: new Date(result.createdAt).valueOf(),
                updatedAt: new Date(result.updatedAt).valueOf(),
            };
        } catch (err) {
            console.error(err);
            throw new NotFoundException(`User with id: ${id} not found`);
        }

        // const existResult = this.dbUsersTableService.findOneById(id);
        // if (existResult.status === Statuses.Failed) {
        //     throw new NotFoundException('User not found');
        // }
        // const {
        //     row: { password },
        // } = existResult;
        // if (this.hashPassword(dto.oldPassword) !== password) {
        //     throw new ForbiddenException(`oldPassowrd is wrong`);
        // }
        // const result = this.dbUsersTableService.update(id, {
        //     password: this.hashPassword(dto.newPassword),
        // });
        // return this.trimPassword(result);
    };

    public delete = async (id: string): Promise<Omit<User, 'password'>> => {
        try {
            const result = await this.prisma.user.delete({
                where: { id },
                select: {
                    id: true,
                    login: true,
                    version: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return {
                ...result,
                createdAt: new Date(result.createdAt).valueOf(),
                updatedAt: new Date(result.updatedAt).valueOf(),
            };
        } catch (err) {
            console.log(err);
            throw new NotFoundException(`User with id: ${id} not found`);
        }
        // this.trimPassword(this.dbUsersTableService.delete(id));
    };

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
