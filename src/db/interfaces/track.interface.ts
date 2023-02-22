import { DBSign } from './index.interface';

export interface Track extends DBSign {
    name: string;
    artistId: string | null; // refers to Artist
    albumId: string | null; // refers to Album
    duration: number; // integer number
}

export type TrackKeys = keyof Track;
