import { IsNumber, IsOptional, IsString, NotEquals } from 'class-validator';

export class CreateAlbumDto {
    @IsString()
    name: string;
    @IsNumber()
    year: number;
    @NotEquals(undefined)
    @IsOptional()
    @IsString()
    artistId: string | null;
}
