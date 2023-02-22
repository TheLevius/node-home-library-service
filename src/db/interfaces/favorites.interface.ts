import { Album } from './album.interface';
import { Artist } from './artist.interface';
import { Track } from './track.interface';

export interface Favorites {
    artists: string[]; // favorite artists ids
    albums: string[]; // favorite albums ids
    tracks: string[]; // favorite tracks ids
}
export interface FavoritesResponse {
    artists: Artist[];
    albums: Album[];
    tracks: Track[];
}
export type TableNames = keyof Favorites;
export type FavoriteTableNames =
    | 'favoriteArtist'
    | 'favoriteAlbum'
    | 'favoriteTrack';
