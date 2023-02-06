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
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistsController {
    constructor(private readonly artistsService: ArtistsService) {}
    @Get()
    getAll() {
        const result = this.artistsService.findAll();
        return result;
    }
    @Get(':id')
    getOne(@Param('id', ParseUUIDPipe) id: string) {
        const result = this.artistsService.findOneById(id);
        if (result.status === Statuses.Failed) {
            throw new NotFoundException('User not found');
        }
        return result.row;
    }
    @Post()
    create(@Body() dto: CreateArtistDto) {
        const result = this.artistsService.create(dto);
        if (result.status === Statuses.Failed) {
            throw new BadRequestException('Bad Request');
        }
        return result.row;
    }
    @Put(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateArtistDto
    ) {
        const result = this.artistsService.update(id, dto);
        if (result.status === Statuses.Failed) {
            throw new BadRequestException('Bad Request');
        }
        return result.row;
    }
    @HttpCode(204)
    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        const result = this.artistsService.delete(id);
        if (result.status === Statuses.Failed) {
            throw new BadRequestException('Bad Request');
        }
        return result.row;
    }
}
