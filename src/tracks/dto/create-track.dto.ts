import { IsInt, IsString, ValidateIf } from 'class-validator';

export class CreateTrackDto {
    @IsString()
    name!: string;
    @ValidateIf((_object, value) => value !== null)
    @IsString()
    artistId: string | null; // refers to Artist
    @ValidateIf((_object, value) => value !== null)
    @IsString()
    albumId: string | null; // refers to Album
    @IsInt()
    duration!: number; // integer number
}
