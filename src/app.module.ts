import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { TracksModule } from './tracks/tracks.module';
import { FavsModule } from './favs/favs.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger/logger.module';
import { MyLoggerService } from './logger/logger.service';
import { LoggerMiddleware } from './logger/logger.middleware';
import { MyExceptionFilter } from './logger/MyExceptionsFilter.service';
@Module({
    imports: [
        DbModule,
        UsersModule,
        ArtistsModule,
        AlbumsModule,
        TracksModule,
        FavsModule,
        AuthModule,
        ConfigModule.forRoot({
            envFilePath: ['.env'],
            isGlobal: true,
        }),
        LoggerModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: MyExceptionFilter,
        },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule implements NestModule {
    constructor(private myLoggerService: MyLoggerService) {}
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
        process.on('uncaughtException', (err) => {
            this.myLoggerService.error(
                `Uncaught Exception ... name ${err.name}, message ${err.message} For more enable debug`
            );
            this.myLoggerService.debug(`Uncaught Exception ... ${err.stack}`);
        });

        process.on('unhandledRejection', (err: Error) => {
            this.myLoggerService.error(
                `Unhandled Rejection ... name ${err.name}, message ${err.message} For more enable debug`
            );
            this.myLoggerService.debug(`Unhandled Rejection ... ${err.stack}`);
        });
    }
}
