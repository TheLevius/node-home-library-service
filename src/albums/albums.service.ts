import { Injectable } from '@nestjs/common';
import { Result } from 'src/db/interfaces/result.interface';
import { DbAlbumsTableService } from 'src/db/table.album.service';
import { DbArtistsTableService } from 'src/db/table.artist.service';
import { DbFavoritesTableService } from 'src/db/table.favorites.service';
import { DbTracksTableService } from 'src/db/table.track.service';
import { DbUsersTableService } from 'src/db/table.users.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './interfaces/album.interface';

@Injectable()
export class AlbumsService {
    constructor(
        private readonly dbUsersTableService: DbUsersTableService,
        private readonly dbArtistsTableService: DbArtistsTableService,
        private readonly dbAlbumsTableService: DbAlbumsTableService,
        private readonly dbTracksTableService: DbTracksTableService,
        private readonly dbFavoritesTableService: DbFavoritesTableService
    ) {}

    findAll = (): Album[] => this.dbAlbumsTableService.findAll();

    findOneById = (id: string): Result<Album> => {
        return this.dbAlbumsTableService.findOneById(id);
    };

    create = (dto: CreateAlbumDto): Result<Album> =>
        this.dbAlbumsTableService.create(dto);

    update = (id: string, dto: UpdateAlbumDto): Result<Album> =>
        this.dbAlbumsTableService.update(id, dto);

    delete = (id: string): Result<Album> => {
        this.dbFavoritesTableService.delete(id, 'albums');
        const albumTracks = this.dbTracksTableService.findMany({
            key: 'albumId',
            equals: id,
        });
        albumTracks.forEach((track) =>
            this.dbTracksTableService.update(track.id, { albumId: null })
        );
        return this.dbAlbumsTableService.delete(id);
    };
}
