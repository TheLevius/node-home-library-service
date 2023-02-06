import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
} from '@nestjs/common';

import { Statuses } from 'src/db/interfaces/statuses.interface';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumsController {
    constructor(private readonly albumsService: AlbumsService) {}
    @Get()
    getAll() {
        const result = this.albumsService.findAll();
        return result;
    }
    @Get(':id')
    getOne(@Param('id', ParseUUIDPipe) id: string) {
        const result = this.albumsService.findOneById(id);
        if (result.status === Statuses.Failed) {
            throw new NotFoundException('Album was not found');
        }
        return result.row;
    }
    @Post()
    create(@Body() dto: CreateAlbumDto) {
        const result = this.albumsService.create(dto);
        if (result.status === Statuses.Failed) {
            throw new BadRequestException('Bad Request');
        }
        return result.row;
    }
    @Put(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateAlbumDto
    ) {
        const result = this.albumsService.update(id, dto);
        if (result.status === Statuses.Failed) {
            throw new BadRequestException('Bad Request');
        }
        return result.row;
    }
    @HttpCode(204)
    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        const result = this.albumsService.delete(id);
        if (result.status === Statuses.Failed) {
            throw new NotFoundException('Bad Request');
        }
        return result.row;
    }
}
