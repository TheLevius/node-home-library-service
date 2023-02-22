import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Result } from 'src/db/interfaces/result.interface';
import { PrismaService } from 'src/db/prisma.service';
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
        private readonly dbFavoritesTableService: DbFavoritesTableService,
        private prisma: PrismaService
    ) {}

    findAll = async (): Promise<Track[]> => this.prisma.track.findMany();

    findOneById = async (id: string): Promise<Track> => {
        try {
            const result = await this.prisma.track.findUniqueOrThrow({
                where: { id },
            });
            return result;
        } catch (err) {
            console.error(err);
            throw new NotFoundException(`Track with id: ${id} not found`);
        }
    };

    // this.dbTracksTableService.findOneById(id);

    create = async (dto: CreateTrackDto): Promise<Track> =>
        this.prisma.track.create({ data: dto });
    // this.dbTracksTableService.create(dto);

    update = async (id: string, dto: UpdateTrackDto): Promise<Track> => {
        try {
            const result = await this.prisma.track.update({
                where: { id },
                data: dto,
            });
            return result;
        } catch (err) {
            console.error(err);
            throw new NotFoundException('Track was not found');
        }
    };
    // this.dbTracksTableService.update(id, dto);

    delete = async (id: string): Promise<Track> => {
        try {
            const result = await this.prisma.track.delete({ where: { id } });
            return result;
        } catch (err) {
            console.error(err);
            throw new NotFoundException(`Track with id: ${id} does not exist`);
        }
        // this.dbFavoritesTableService.delete(id, 'tracks');
        // return this.dbTracksTableService.delete(id);
    };
}
