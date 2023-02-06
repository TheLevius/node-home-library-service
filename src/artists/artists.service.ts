import { Injectable, NotFoundException } from '@nestjs/common';
import { Result } from 'src/db/interfaces/result.interface';
import { Statuses } from 'src/db/interfaces/statuses.interface';
import { DbAlbumsTableService } from 'src/db/table.album.service';
import { DbArtistsTableService } from 'src/db/table.artist.service';
import { DbFavoritesTableService } from 'src/db/table.favorites.service';
import { DbTracksTableService } from 'src/db/table.track.service';
import { DbUsersTableService } from 'src/db/table.users.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './interfaces/artist.interface';

@Injectable()
export class ArtistsService {
    constructor(
        private readonly dbUsersTableService: DbUsersTableService,
        private readonly dbArtistsTableService: DbArtistsTableService,
        private readonly dbAlbumsTableService: DbAlbumsTableService,
        private readonly dbTracksTableService: DbTracksTableService,
        private readonly dbFavoritesTableService: DbFavoritesTableService
    ) {}

    findAll = (): Artist[] => this.dbArtistsTableService.findAll();

    findOneById = (id: string): Result<Artist> =>
        this.dbArtistsTableService.findOneById(id);

    create = (dto: CreateArtistDto): Result<Artist> =>
        this.dbArtistsTableService.create(dto);

    update = (id: string, dto: UpdateArtistDto): Result<Artist> => {
        const result = this.dbArtistsTableService.update(id, dto);
        if (result.status === Statuses.Failed) {
            throw new NotFoundException(`Artists doesn't exist`);
        }
        return result;
    };

    delete = (id: string): Result<Artist> => {
        const result = this.dbArtistsTableService.findOneById(id);
        if (result.status === Statuses.Failed) {
            throw new NotFoundException(`User doesn't exist`);
        }
        this.dbFavoritesTableService.delete(id, 'artists');
        const artistAlbums = this.dbAlbumsTableService.findMany({
            key: 'artistId',
            equals: id,
        });
        artistAlbums.forEach((album) =>
            this.dbAlbumsTableService.update(album.id, { artistId: null })
        );
        const artistTracks = this.dbTracksTableService.findMany({
            key: 'artistId',
            equals: id,
        });
        artistTracks.forEach((track) =>
            this.dbTracksTableService.update(track.id, { artistId: null })
        );
        return this.dbArtistsTableService.delete(id);
    };
}
