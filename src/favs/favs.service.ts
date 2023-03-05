import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { FavoritesResponse } from './interfaces/favorites.interface';

@Injectable()
export class FavsService {
    constructor(private prisma: PrismaService) {}
    findAll = async (): Promise<FavoritesResponse> => {
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
        ]).catch(() => {
            throw new BadRequestException('PROMISE ALL BAD');
        });
        return {
            artists: artists.map(({ artist }) => artist),
            albums: albums.map(({ album }) => album),
            tracks: tracks.map(({ track }) => track),
        };
    };
    createFavoriteArtist = async (id: string) => {
        try {
            const result = await this.prisma.favoriteArtist.create({
                data: { artistId: id },
            });
            return result;
        } catch (err) {
            throw new UnprocessableEntityException(
                `artist with id: ${id} does not exist`
            );
        }
    };
    deleteFavoriteArtist = async (id: string) => {
        try {
            const result = await this.prisma.favoriteArtist.delete({
                where: { artistId: id },
            });
            return result;
        } catch (err) {
            throw new NotFoundException(`artist was not found`);
        }
    };
    createFavoriteAlbum = async (id: string) => {
        try {
            const result = await this.prisma.favoriteAlbum.create({
                data: { albumId: id },
            });
            return result;
        } catch (err) {
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
            throw new NotFoundException(`Track was not found`);
        }
    };
}
