export interface UpdateAlbumDto {
    name?: string;
    year?: number;
    artistId?: string | null; // refers to Artist
}
