import { Injectable } from '@nestjs/common';
import { Favorites, TableNames } from './interfaces/favorites.interface';

@Injectable()
export class DbFavoritesTableService {
    private readonly schema: Favorites = {
        artists: [],
        albums: [],
        tracks: [],
    };
    public findAll = (): Favorites => ({
        artists: this.schema.artists.slice(),
        albums: this.schema.albums.slice(),
        tracks: this.schema.tracks.slice(),
    });
    public findAllTableOf = (table: TableNames): string[] =>
        this.schema[table].slice();
    public isExist = (id: string, table: TableNames) =>
        this.schema[table].includes(id);

    public create = (id: string, table: TableNames): string => {
        this.schema[table].push(id);
        return id;
    };
    public delete = (id: string, table: TableNames): string => {
        this.schema[table] = this.schema[table].filter(
            (tableId) => tableId !== id
        );
        return id;
    };
}
