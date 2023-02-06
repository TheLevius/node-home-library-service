import {
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { Album } from 'src/db/interfaces/album.interface';
import { Artist } from 'src/db/interfaces/artist.interface';
import {
    FavoritesResponse,
    TableNames,
} from 'src/db/interfaces/favorites.interface';
import { Statuses } from 'src/db/interfaces/statuses.interface';
import { Track } from 'src/db/interfaces/track.interface';
import { DbAlbumsTableService } from 'src/db/table.album.service';
import { DbArtistsTableService } from 'src/db/table.artist.service';
import { DbFavoritesTableService } from 'src/db/table.favorites.service';
import { DbTracksTableService } from 'src/db/table.track.service';

@Injectable()
export class FavsService {
    constructor(
        private readonly artists: DbArtistsTableService,
        private readonly albums: DbAlbumsTableService,
        private readonly tracks: DbTracksTableService,
        private readonly dbFavoritesTableService: DbFavoritesTableService
    ) {}
    findAll = (): FavoritesResponse => {
        const {
            artists: artistIds,
            albums: albumIds,
            tracks: trackIds,
        } = this.dbFavoritesTableService.findAll();
        const favoriteArtists = artistIds.reduce(
            (artists: Artist[], artistId) => {
                const result = this.artists.findOneById(artistId);
                if (result.status === Statuses.Ok) {
                    artists.push(result.row);
                }
                return artists;
            },
            []
        );
        const favoriteAlbums = albumIds.reduce((albums: Album[], albumId) => {
            const result = this.albums.findOneById(albumId);
            if (result.status === Statuses.Ok) {
                albums.push(result.row);
            }
            return albums;
        }, []);
        const favoriteTracks = trackIds.reduce((tracks: Track[], trackId) => {
            const result = this.tracks.findOneById(trackId);
            if (result.status === Statuses.Ok) {
                tracks.push(result.row);
            }
            return tracks;
        }, []);
        return {
            artists: favoriteArtists,
            albums: favoriteAlbums,
            tracks: favoriteTracks,
        };
    };
    create = (id: string, table: TableNames) => {
        const existResult = this[table].findOneById(id);
        if (existResult.status === Statuses.Failed) {
            throw new UnprocessableEntityException(
                `${table[0].toUpperCase()}${table.slice(
                    1,
                    table.length - 1
                )} with id: ${id} does not exist`
            );
        }
        const result = {
            status: Statuses.Ok,
            row: id,
        };
        if (this.dbFavoritesTableService.isExist(id, table)) {
            return result;
        }
        this.dbFavoritesTableService.create(id, table);
        return result;
    };
    delete = (id: string, table: TableNames) => {
        if (!this.dbFavoritesTableService.isExist(id, table)) {
            throw new NotFoundException(
                `${table[0].toUpperCase()}${table.slice(
                    1,
                    table.length - 1
                )} was not found`
            );
        }
        return {
            status: Statuses.Ok,
            row: this.dbFavoritesTableService.delete(id, table),
        };
    };
}
