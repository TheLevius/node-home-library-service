import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
    constructor(private prisma: PrismaService) {}

    findAll = async (): Promise<Album[]> => this.prisma.album.findMany();

    findOneById = async (id: string): Promise<Album> => {
        try {
            const result = await this.prisma.album.findUniqueOrThrow({
                where: { id },
            });
            return result;
        } catch (err) {
            throw new NotFoundException('Album was not found');
        }
    };

    create = async (dto: CreateAlbumDto): Promise<Album> =>
        this.prisma.album.create({ data: dto });

    update = async (id: string, dto: UpdateAlbumDto): Promise<Album> => {
        try {
            const result = await this.prisma.album.update({
                where: { id },
                data: dto,
            });
            return result;
        } catch (err) {
            throw new NotFoundException('Album was not found');
        }
    };

    delete = async (id: string): Promise<Album> => {
        try {
            const result = await this.prisma.album.delete({ where: { id } });
            return result;
        } catch (err) {
            throw new NotFoundException(`Album with id: ${id} doesn't exist`);
        }
    };
}
