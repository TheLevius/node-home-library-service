import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateTrackDto } from './dto/track/create-track.dto';
import { UpdateTrackDto } from './dto/track/update-track.dto';
import { Result } from './interfaces/result.interface';
import { Statuses } from './interfaces/statuses.interface';
import { Track, TrackKeys } from './interfaces/track.interface';

@Injectable()
export class DbTracksTableService {
    private table: Track[] = [];
    public findAll = (): Track[] => this.table.map((row) => ({ ...row }));
    public findMany = ({
        key,
        equals,
    }: {
        key: TrackKeys;
        equals: unknown;
    }): Track[] => {
        return this.table.reduce((result: Track[], track) => {
            if (track[key] === equals) result.push({ ...track });
            return result;
        }, []);
    };
    public findOneById = (id: string): Result<Track> => {
        const index = this.table.findIndex((row: Track) => row.id === id);
        if (index < 0) {
            return { status: Statuses.Failed };
        }

        return {
            row: { ...this.table[index] },
            index,
            status: Statuses.Ok,
        };
    };
    public create = (dto: CreateTrackDto): Result<Track> => {
        const row: Track = {
            id: randomUUID(),
            artistId: null,
            albumId: null,
            ...dto,
        };
        this.table.push({ ...row });
        return { row, status: Statuses.Ok };
    };
    public update = (id: string, dto: UpdateTrackDto): Result<Track> => {
        const result = this.findOneById(id);
        if (result.status === Statuses.Failed) {
            return result;
        }
        const { row, index } = result;
        this.table[index] = { ...row, ...dto };
        return { row: { ...this.table[index] }, status: Statuses.Ok };
    };
    public delete = (id: string): Result<Track> => {
        const result = this.findOneById(id);
        if (result.status === Statuses.Failed) {
            throw new NotFoundException('Track not found');
        }
        this.table = this.table.filter((row) => row.id !== id);
        return {
            row: result.row,
            status: Statuses.Ok,
        };
    };
}
