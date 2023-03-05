import {
    BadRequestException,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseUUIDPipe,
    Post,
} from '@nestjs/common';

import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
    constructor(private readonly favsService: FavsService) {}
    @Get()
    async getAll() {
        return this.favsService.findAll();
    }
    @Post('track/:id')
    async createTrack(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.favsService.createFavoriteTrack(id);
        return { id: result };
    }
    @HttpCode(204)
    @Delete('track/:id')
    async deleteTrack(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.favsService.deleteFavoriteTrack(id);
        return { id: result };
    }

    @Post('album/:id')
    async createAlbum(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.favsService.createFavoriteAlbum(id);
        return { id: result };
    }
    @HttpCode(204)
    @Delete('album/:id')
    async deleteAlbum(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.favsService.deleteFavoriteAlbum(id);
        return { id: result };
    }

    @Post('artist/:id')
    async createArtist(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.favsService.createFavoriteArtist(id);
        return { id: result };
    }
    @HttpCode(204)
    @Delete('artist/:id')
    async deleteArtist(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.favsService.deleteFavoriteArtist(id);
        return { id: result };
    }
}
