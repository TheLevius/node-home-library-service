import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { createHash } from 'node:crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';
import { UserResponse } from './interfaces/user.interface';

// const salt = String(process.env.CRYPTO_SALT);
@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

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

    public findOneById = async (id: string): Promise<UserResponse> => {
        try {
            const result = await this.prisma.user.findUniqueOrThrow({
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
            throw new NotFoundException(`User with id: ${id} not found`);
        }
    };

    public create = async ({
        login,
        password,
    }: CreateUserDto): Promise<UserResponse> => {
        try {
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
        } catch (err) {
            throw new BadRequestException('login already exists!');
        }
    };
    public checkLogin = async ({
        login,
        password,
    }: CreateUserDto): Promise<{ login: string; id: string }> => {
        let user: User;
        try {
            user = await this.prisma.user.findFirstOrThrow({
                where: { login },
            });
        } catch (err) {
            throw new NotFoundException(`User not found`);
        }
        if (this.hashPassword(password) !== user.password) {
            throw new ForbiddenException(`Password is wrong`);
        }
        return { login: user.login, id: user.id };
    };
    public update = async (
        id: string,
        dto: UpdatePasswordDto
    ): Promise<UserResponse> => {
        let user: User;
        try {
            user = await this.prisma.user.findFirstOrThrow({ where: { id } });
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
            throw new NotFoundException(`User with id: ${id} not found`);
        }
    };

    public delete = async (id: string): Promise<UserResponse> => {
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
            throw new NotFoundException(`User with id: ${id} not found`);
        }
    };
    private hashPassword = (password: string): string =>
        createHash('sha256').update(password).digest('hex');
}
