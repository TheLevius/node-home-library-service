import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
// import { Album } from 'src/db/interfaces/album.interface';
// import { Artist } from 'src/db/interfaces/artist.interface';
// import { Track } from 'src/db/interfaces/track.interface';
import {
    FavoritesResponse,
    FavoriteTableNames,
    TableNames,
} from 'src/db/interfaces/favorites.interface';
import { Statuses } from 'src/db/interfaces/statuses.interface';

import { PrismaService } from 'src/db/prisma.service';
import { DbAlbumsTableService } from 'src/db/table.album.service';
import { DbArtistsTableService } from 'src/db/table.artist.service';
import { DbFavoritesTableService } from 'src/db/table.favorites.service';
import { DbTracksTableService } from 'src/db/table.track.service';
import {
    FavoriteArtist,
    FavoriteAlbum,
    FavoriteTrack,
    Artist,
    Album,
    Track,
} from '@prisma/client';

@Injectable()
export class FavsService {
    constructor(
        private readonly artists: DbArtistsTableService,
        private readonly albums: DbAlbumsTableService,
        private readonly tracks: DbTracksTableService,
        private readonly dbFavoritesTableService: DbFavoritesTableService,
        private prisma: PrismaService
    ) {}
    findAll = async (): Promise<any> => {
        const [artists, albums, tracks] = await Promise.all([
            this.prisma.favoriteArtist.findMany({
                select: { artist: true },
            }),
            this.prisma.favoriteAlbum.findMany({
                select: { album: true },
            }),
            this.prisma.favoriteTrack.findMany({
                select: { track: true },
            }),
        ]);
        return {
            artists: artists.map(({ artist }) => artist),
            albums: albums.map(({ album }) => album),
            tracks: tracks.map(({ track }) => track),
        };

        // const {
        //     artists: artistIds,
        //     albums: albumIds,
        //     tracks: trackIds,
        // } = this.dbFavoritesTableService.findAll();
        // const favoriteArtists = artistIds.reduce(
        //     (artists: Artist[], artistId) => {
        //         const result = this.artists.findOneById(artistId);
        //         if (result.status === Statuses.Ok) {
        //             artists.push(result.row);
        //         }
        //         return artists;
        //     },
        //     []
        // );
        // const favoriteAlbums = albumIds.reduce((albums: Album[], albumId) => {
        //     const result = this.albums.findOneById(albumId);
        //     if (result.status === Statuses.Ok) {
        //         albums.push(result.row);
        //     }
        //     return albums;
        // }, []);
        // const favoriteTracks = trackIds.reduce((tracks: Track[], trackId) => {
        //     const result = this.tracks.findOneById(trackId);
        //     if (result.status === Statuses.Ok) {
        //         tracks.push(result.row);
        //     }
        //     return tracks;
        // }, []);
        // return {
        //     artists: favoriteArtists,
        //     albums: favoriteAlbums,
        //     tracks: favoriteTracks,
        // };
    };
    createFavoriteArtist = async (id: string) => {
        try {
            const result = await this.prisma.favoriteArtist.create({
                data: { artistId: id },
            });
            return result;
        } catch (err) {
            console.error(err);
            throw new UnprocessableEntityException(
                `artist with id: ${id} does not exist`
            );
        }
        //     const existResult = this[table].findOneById(id);
        //     if (existResult.status === Statuses.Failed) {
        //         throw new UnprocessableEntityException(
        //             `${table[0].toUpperCase()}${table.slice(
        //                 1,
        //                 table.length - 1
        //             )} with id: ${id} does not exist`
        //         );
        //     }
        //     const result = {
        //         status: Statuses.Ok,
        //         row: id,
        //     };
        //     if (this.dbFavoritesTableService.isExist(id, table)) {
        //         return result;
        //     }
        //     this.dbFavoritesTableService.create(id, table);
        //     return result;
        // };
    };
    deleteFavoriteArtist = async (id: string): Promise<FavoriteArtist> => {
        try {
            const result = await this.prisma.favoriteArtist.delete({
                where: { artistId: id },
            });
            return result;
        } catch (err) {
            console.error(err);
            throw new NotFoundException(`artist was not found`);
        }
        // if (!this.dbFavoritesTableService.isExist(id, table)) {
        //     throw new NotFoundException(
        //         `${table[0].toUpperCase()}${table.slice(
        //             1,
        //             table.length - 1
        //         )} was not found`
        //     );
        // }
        // return {
        //     status: Statuses.Ok,
        //     row: this.dbFavoritesTableService.delete(id, table),
        // };
    };
    createFavoriteAlbum = async (id: string) => {
        try {
            const result = await this.prisma.favoriteAlbum.create({
                data: { albumId: id },
            });
            return result;
        } catch (err) {
            console.error(err);
            throw new UnprocessableEntityException(
                `Album with id: ${id} does not exist`
            );
        }
    };
    deleteFavoriteAlbum = async (id: string) => {
        try {
            const result = await this.prisma.favoriteAlbum.delete({
                where: { albumId: id },
            });
            return result;
        } catch (err) {
            console.error(err);
            throw new NotFoundException(`Album was not found`);
        }
    };
    createFavoriteTrack = async (id: string) => {
        try {
            const result = await this.prisma.favoriteTrack.create({
                data: { trackId: id },
            });
            return result;
        } catch (err) {
            console.error(err);
            throw new UnprocessableEntityException(
                `Track with id: ${id} does not exist`
            );
        }
    };
    deleteFavoriteTrack = async (id: string) => {
        try {
            const result = await this.prisma.favoriteTrack.delete({
                where: { trackId: id },
            });
            return result;
        } catch (err) {
            console.error(err);
            throw new NotFoundException(`Track was not found`);
        }
    };
}
