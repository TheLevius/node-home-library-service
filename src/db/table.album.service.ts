import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateAlbumDto } from './dto/album/create-album.dto';
import { UpdateAlbumDto } from './dto/album/update-album.dto';
import { Album, AlbumKeys } from './interfaces/album.interface';
import { Result } from './interfaces/result.interface';
import { Statuses } from './interfaces/statuses.interface';

@Injectable()
export class DbAlbumsTableService {
    private table: Album[] = [];
    public findAll = (): Album[] => this.table.map((row) => ({ ...row }));
    public findMany = ({
        key,
        equals,
    }: {
        key: AlbumKeys;
        equals: unknown;
    }): Album[] => {
        return this.table.reduce((result: Album[], album) => {
            if (album[key] === equals) result.push({ ...album });
            return result;
        }, []);
    };
    public findOneById = (id: string): Result<Album> => {
        const index = this.table.findIndex((row) => row.id === id);
        if (index < 0) {
            return { status: Statuses.Failed };
        }

        return {
            row: { ...this.table[index] },
            index,
            status: Statuses.Ok,
        };
    };
    public create = (dto: CreateAlbumDto): Result<Album> => {
        const row: Album = {
            id: randomUUID(),
            artistId: null,
            ...dto,
        };
        this.table.push({ ...row });
        return { row, status: Statuses.Ok };
    };
    public update = (id: string, dto: UpdateAlbumDto): Result<Album> => {
        const result = this.findOneById(id);
        if (result.status === Statuses.Failed) {
            throw new NotFoundException('Album was not found');
        }
        const { row, index } = result;
        this.table[index] = { ...row, ...dto };
        return { row: { ...this.table[index] }, status: Statuses.Ok };
    };
    public delete = (id: string): Result<Album> => {
        const result = this.findOneById(id);
        if (result.status === Statuses.Failed) {
            throw new NotFoundException('Album was not found');
        }
        this.table = this.table.filter((row) => row.id !== id);
        return {
            row: result.row,
            status: Statuses.Ok,
        };
    };
}
