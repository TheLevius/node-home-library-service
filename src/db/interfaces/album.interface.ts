import { DBSign } from './index.interface';
export interface Album extends DBSign {
    name: string;
    year: number;
    artistId: string | null; // refers to Artist
}
export type AlbumKeys = keyof Album;
