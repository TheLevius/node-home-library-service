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
import { Statuses } from 'src/db/interfaces/statuses.interface';

import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
    constructor(private readonly favsService: FavsService) {}
    @Get()
    async getAll() {
        const result = await this.favsService.findAll();
        return result;
    }
    @Post('track/:id')
    async createTrack(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.favsService.createFavoriteTrack(id);
        // if (result.status === Statuses.Failed) {
        //     throw new BadRequestException('Bad Request');
        // }
        return { id: result };
    }
    @HttpCode(204)
    @Delete('track/:id')
    async deleteTrack(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.favsService.deleteFavoriteTrack(id);
        // if (result.status === Statuses.Failed) {
        //     throw new BadRequestException('Bad Request');
        // }
        return { id: result };
    }

    @Post('album/:id')
    async createAlbum(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.favsService.createFavoriteAlbum(id);
        // if (result.status === Statuses.Failed) {
        //     throw new BadRequestException('Bad Request');
        // }
        return { id: result };
    }
    @HttpCode(204)
    @Delete('album/:id')
    async deleteAlbum(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.favsService.deleteFavoriteAlbum(id);
        // if (result.status === Statuses.Failed) {
        //     throw new BadRequestException('Bad Request');
        // }
        return { id: result };
    }

    @Post('artist/:id')
    async createArtist(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.favsService.createFavoriteArtist(id);
        // if (result.status === Statuses.Failed) {
        //     throw new BadRequestException('Bad Request');
        // }
        return { id: result };
    }
    @HttpCode(204)
    @Delete('artist/:id')
    async deleteArtist(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.favsService.deleteFavoriteArtist(id);
        // if (result.status === Statuses.Failed) {
        //     throw new BadRequestException('Bad Request');
        // }
        return { id: result };
    }
}
