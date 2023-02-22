import { Injectable, NotFoundException } from '@nestjs/common';
import { Result } from 'src/db/interfaces/result.interface';
import { PrismaService } from 'src/db/prisma.service';
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
        private readonly dbFavoritesTableService: DbFavoritesTableService,
        private prisma: PrismaService
    ) {}

    findAll = async (): Promise<Album[]> => this.prisma.album.findMany();

    findOneById = async (id: string): Promise<Album> => {
        try {
            const result = await this.prisma.album.findUniqueOrThrow({
                where: { id },
            });
            return result;
        } catch (err) {
            console.error;
            throw new NotFoundException('Album was not found');
        }
    };

    create = async (dto: CreateAlbumDto): Promise<Album> =>
        this.prisma.album.create({ data: dto });
    // this.dbAlbumsTableService.create(dto);

    update = async (id: string, dto: UpdateAlbumDto): Promise<Album> => {
        try {
            const result = await this.prisma.album.update({
                where: { id },
                data: dto,
            });
            return result;
        } catch (err) {
            console.error(err);
            throw new NotFoundException('Album was not found');
        }
    };
    // this.dbAlbumsTableService.update(id, dto);

    delete = async (id: string): Promise<Album> => {
        try {
            const result = await this.prisma.album.delete({ where: { id } });
            return result;
        } catch (err) {
            console.error(err);
            throw new NotFoundException(`Album with id: ${id} doesn't exist`);
        }
        // this.dbFavoritesTableService.delete(id, 'albums');
        // const albumTracks = this.dbTracksTableService.findMany({
        //     key: 'albumId',
        //     equals: id,
        // });
        // albumTracks.forEach((track) =>
        //     this.dbTracksTableService.update(track.id, { albumId: null })
        // );
        // return this.dbAlbumsTableService.delete(id);
    };
}
