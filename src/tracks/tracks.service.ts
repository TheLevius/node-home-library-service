import { Injectable } from '@nestjs/common';
import { Result } from 'src/db/interfaces/result.interface';
import { DbAlbumsTableService } from 'src/db/table.album.service';
import { DbArtistsTableService } from 'src/db/table.artist.service';
import { DbFavoritesTableService } from 'src/db/table.favorites.service';
import { DbTracksTableService } from 'src/db/table.track.service';
import { DbUsersTableService } from 'src/db/table.users.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './interfaces/track.interface';

@Injectable()
export class TracksService {
    constructor(
        private readonly dbUsersTableService: DbUsersTableService,
        private readonly dbArtistsTableService: DbArtistsTableService,
        private readonly dbAlbumsTableService: DbAlbumsTableService,
        private readonly dbTracksTableService: DbTracksTableService,
        private readonly dbFavoritesTableService: DbFavoritesTableService
    ) {}

    findAll = (): Track[] => this.dbTracksTableService.findAll();

    findOneById = (id: string): Result<Track> =>
        this.dbTracksTableService.findOneById(id);

    create = (dto: CreateTrackDto): Result<Track> =>
        this.dbTracksTableService.create(dto);

    update = (id: string, dto: UpdateTrackDto): Result<Track> =>
        this.dbTracksTableService.update(id, dto);

    delete = (id: string): Result<Track> => {
        this.dbFavoritesTableService.delete(id, 'tracks');
        return this.dbTracksTableService.delete(id);
    };
}
