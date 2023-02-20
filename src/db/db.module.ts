import { Module } from '@nestjs/common';
import { DbController } from './db.controller';
import { PrismaService } from './prisma.service';
import { DbAlbumsTableService } from './table.album.service';
import { DbArtistsTableService } from './table.artist.service';
import { DbFavoritesTableService } from './table.favorites.service';
import { DbTracksTableService } from './table.track.service';
import { DbUsersTableService } from './table.users.service';

@Module({
    providers: [
        DbUsersTableService,
        DbArtistsTableService,
        DbTracksTableService,
        DbAlbumsTableService,
        DbFavoritesTableService,
        PrismaService,
    ],
    controllers: [DbController],
    exports: [
        DbUsersTableService,
        DbArtistsTableService,
        DbTracksTableService,
        DbAlbumsTableService,
        DbFavoritesTableService,
        PrismaService,
    ],
})
export class DbModule {}
