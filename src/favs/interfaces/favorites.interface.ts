import { Album } from 'src/db/interfaces/album.interface';
import { Artist } from 'src/db/interfaces/artist.interface';
import { Track } from 'src/db/interfaces/track.interface';

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
