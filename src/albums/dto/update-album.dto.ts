import { IsNumber, IsOptional, IsString, NotEquals } from 'class-validator';

export class UpdateAlbumDto {
    @IsOptional()
    @IsString()
    name?: string;
    @IsOptional()
    @IsNumber()
    year?: number;
    @NotEquals(undefined)
    @IsOptional()
    @IsString()
    artistId?: string | null;
}
