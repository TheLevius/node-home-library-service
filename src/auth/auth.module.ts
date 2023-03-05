import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DbModule } from 'src/db/db.module';
import { LoggerModule } from 'src/logger/logger.module';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.stategy';

@Module({
    imports: [
        DbModule,
        UsersModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET_KEY'),
            }),
            inject: [ConfigService],
        }),
        ConfigModule,
        PassportModule,
        LoggerModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, UsersService, JwtStrategy],
})
export class AuthModule {}
