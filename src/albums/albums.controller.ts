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
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumsController {
    constructor(private readonly albumsService: AlbumsService) {}
    @Get()
    async getAll() {
        return this.albumsService.findAll();
    }
    @Get(':id')
    async getOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.albumsService.findOneById(id);
    }
    @Post()
    async create(@Body() dto: CreateAlbumDto) {
        return this.albumsService.create(dto);
    }
    @Put(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateAlbumDto
    ) {
        return this.albumsService.update(id, dto);
    }
    @HttpCode(204)
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.albumsService.delete(id);
    }
}
