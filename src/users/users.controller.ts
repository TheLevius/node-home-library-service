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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Get()
    async getAll() {
        return this.usersService.findAll();
    }
    @Get(':id')
    async getOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.findOneById(id);
    }
    @Post()
    async create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }
    @Put(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdatePasswordDto
    ) {
        return this.usersService.update(id, dto);
    }
    @HttpCode(204)
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.delete(id);
    }
}
