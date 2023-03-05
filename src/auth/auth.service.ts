import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { MyLoggerService } from 'src/logger/logger.service';

const accessSecret = process.env.JWT_SECRET_KEY;
const refreshSecret = process.env.JWT_SECRET_REFRESH_KEY;
const tokenExpire = process.env.TOKEN_EXPIRE_TIME;
const tokenRefreshExpire = process.env.TOKEN_REFRESH_EXPIRE_TIME;

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private loginService: MyLoggerService
    ) {}
    create = async (dto: CreateUserDto) => {
        return this.usersService.create(dto);
    };
    login = async (dto: CreateUserDto) => {
        try {
            const { login, id: userId } = await this.usersService.checkLogin(
                dto
            );
            const [accessToken, refreshToken] = await this.generateTokens({
                login,
                userId,
            });
            return {
                accessToken,
                refreshToken,
            };
        } catch (err) {
            throw new ForbiddenException('incorrect login or password');
        }
    };
    refresh = async (dto: string) => {
        const { login, userId } = await this.jwtService
            .verifyAsync<{
                login: string;
                userId: string;
            }>(dto, {
                secret: refreshSecret,
            })
            .catch(() => {
                throw new ForbiddenException('invalid token');
            });
        const [accessToken, refreshToken] = await this.generateTokens({
            login,
            userId,
        });
        return {
            accessToken,
            refreshToken,
        };
    };

    generateTokens = async (payload: { login: string; userId: string }) =>
        Promise.all([
            this.generateToken(payload, {
                secret: accessSecret,
                expiresIn: tokenExpire,
            }),
            this.generateToken(payload, {
                secret: refreshSecret,
                expiresIn: tokenRefreshExpire,
            }),
        ]);

    generateToken = async (
        payload: { login: string; userId: string },
        { secret, expiresIn }: { secret: string; expiresIn: string }
    ) => this.jwtService.signAsync(payload, { secret, expiresIn });
}
