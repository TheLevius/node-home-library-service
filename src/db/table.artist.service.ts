import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateArtistDto } from './dto/artist/create-artist.dto';
import { UpdateArtistDto } from './dto/artist/update-artist.dto';
import { Artist, ArtistKeys } from './interfaces/artist.interface';
import { Result } from './interfaces/result.interface';
import { Statuses } from './interfaces/statuses.interface';

@Injectable()
export class DbArtistsTableService {
    private table: Artist[] = [];
    public findAll = (): Artist[] => this.table.map((row) => ({ ...row }));
    public findMany = ({
        key,
        equals,
    }: {
        key: ArtistKeys;
        equals: unknown;
    }): Artist[] => {
        return this.table.reduce((result: Artist[], artist) => {
            if (artist[key] === equals) result.push({ ...artist });
            return result;
        }, []);
    };
    public findOneById = (id: string): Result<Artist> => {
        const index = this.table.findIndex((row) => row.id === id);
        if (index < 0) {
            return { status: Statuses.Failed };
        }
        return {
            status: Statuses.Ok,
            index,
            row: { ...this.table[index] },
        };
    };
    public create = (dto: CreateArtistDto): Result<Artist> => {
        const row: Artist = {
            id: randomUUID(),
            ...dto,
        };
        this.table.push({ ...row });
        return { row, status: Statuses.Ok };
    };
    public update = (id: string, dto: UpdateArtistDto): Result<Artist> => {
        const result = this.findOneById(id);
        if (result.status === Statuses.Failed) {
            return result;
        }
        const { row, index } = result;
        this.table[index] = { ...row, ...dto };
        return { row: { ...this.table[index] }, status: Statuses.Ok };
    };
    public delete = (id: string): Result<Artist> => {
        const result = this.findOneById(id);
        if (result.status === Statuses.Failed) {
            return result;
        }
        this.table = this.table.filter((row) => row.id !== id);
        return {
            row: result.row,
            status: Statuses.Ok,
        };
    };
}
