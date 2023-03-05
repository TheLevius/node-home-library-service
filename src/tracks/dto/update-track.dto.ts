import { IsInt, IsOptional, IsString, NotEquals } from 'class-validator';

export class UpdateTrackDto {
    @IsOptional()
    @IsString()
    name?: string;
    @NotEquals(undefined)
    @IsOptional()
    @IsString()
    artistId?: string | null; // refers to Artist
    @NotEquals(undefined)
    @IsOptional()
    @IsString()
    albumId?: string | null; // refers to Album
    @IsOptional()
    @IsInt()
    duration?: number; // integer number
}
