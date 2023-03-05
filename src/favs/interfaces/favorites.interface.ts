import { Artist, Album, Track } from '@prisma/client';

export interface FavoriteIds {
    artists: string[]; // favorite artists ids
    albums: string[]; // favorite albums ids
    tracks: string[]; // favorite tracks ids
}
export interface FavoritesResponse {
    artists: Artist[];
    albums: Album[];
    tracks: Track[];
}
