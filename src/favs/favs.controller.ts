import {
    BadRequestException,
    Controller,
    Delete,
    Get,
    Param,
    Post,
} from '@nestjs/common';
import { Statuses } from 'src/db/interfaces/statuses.interface';

import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
    constructor(private readonly favsService: FavsService) {}
    @Get()
    getAll() {
        const result = this.favsService.findAll();
        return result;
    }
    @Post('track/:id')
    createTrack(@Param('id') id: string) {
        const result = this.favsService.create(id, 'tracks');
        if (result.status === Statuses.Failed) {
            throw new BadRequestException('Bad Request');
        }
        return result.row;
    }
    @Delete('track/:id')
    deleteTrack(@Param('id') id: string) {
        const result = this.favsService.delete(id, 'tracks');
        if (result.status === Statuses.Failed) {
            throw new BadRequestException('Bad Request');
        }
        return result.row;
    }

    @Post('album/:id')
    createAlbum(@Param('id') id: string) {
        const result = this.favsService.create(id, 'albums');
        if (result.status === Statuses.Failed) {
            throw new BadRequestException('Bad Request');
        }
        return result.row;
    }
    @Delete('album/:id')
    deleteAlbum(@Param('id') id: string) {
        const result = this.favsService.delete(id, 'albums');
        if (result.status === Statuses.Failed) {
            throw new BadRequestException('Bad Request');
        }
        return result.row;
    }

    @Post('artist/:id')
    createArtist(@Param('id') id: string) {
        const result = this.favsService.create(id, 'artists');
        if (result.status === Statuses.Failed) {
            throw new BadRequestException('Bad Request');
        }
        return result.row;
    }
    @Delete('artist/:id')
    deleteArtist(@Param('id') id: string) {
        const result = this.favsService.delete(id, 'artists');
        if (result.status === Statuses.Failed) {
            throw new BadRequestException('Bad Request');
        }
        return result.row;
    }
}
