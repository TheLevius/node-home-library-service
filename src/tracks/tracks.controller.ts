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
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TracksService } from './tracks.service';

@Controller('track')
export class TracksController {
    constructor(private readonly tracksService: TracksService) {}
    @Get()
    async getAll() {
        return this.tracksService.findAll();
    }
    @Get(':id')
    async getOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.tracksService.findOneById(id);
    }
    @Post()
    async create(@Body() dto: CreateTrackDto) {
        return this.tracksService.create(dto);
    }
    @Put(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateTrackDto
    ) {
        return this.tracksService.update(id, dto);
    }
    @HttpCode(204)
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.tracksService.delete(id);
    }
}
