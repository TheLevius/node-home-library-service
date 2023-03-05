import { Injectable, NotFoundException } from '@nestjs/common';
import { Artist } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistsService {
    constructor(private prisma: PrismaService) {}

    findAll = async (): Promise<Artist[]> => this.prisma.artist.findMany();

    findOneById = async (id: string): Promise<Artist> => {
        try {
            const result = await this.prisma.artist.findUniqueOrThrow({
                where: { id },
            });
            return result;
        } catch (err) {
            throw new NotFoundException(`Artist with id: ${id} not found`);
        }
    };

    create = async (dto: CreateArtistDto): Promise<Artist> =>
        this.prisma.artist.create({ data: dto });

    update = async (id: string, dto: UpdateArtistDto): Promise<Artist> => {
        try {
            const result = await this.prisma.artist.update({
                where: { id },
                data: dto,
            });
            return result;
        } catch (err) {
            throw new NotFoundException(`Artists doesn't exist`);
        }
    };

    delete = async (id: string): Promise<Artist> => {
        try {
            const result = await this.prisma.artist.delete({ where: { id } });
            return result;
        } catch (err) {
            throw new NotFoundException(`User doesn't exist`);
        }
    };
}
