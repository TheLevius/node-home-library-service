import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistsController {
    constructor(private readonly artistsService: ArtistsService) {}
    @Get()
    async getAll() {
        return this.artistsService.findAll();
    }
    @Get(':id')
    async getOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.artistsService.findOneById(id);
    }
    @Post()
    async create(@Body() dto: CreateArtistDto) {
        return this.artistsService.create(dto);
    }
    @Put(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateArtistDto
    ) {
        return this.artistsService.update(id, dto);
    }
    @HttpCode(204)
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.artistsService.delete(id);
    }
}
