import {
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
// import { Statuses } from 'src/db/interfaces/statuses.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Get()
    async getAll() {
        const result = await this.usersService.findAll();
        return result;
    }
    @Get(':id')
    async getOne(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.usersService.findOneById(id);
        return result;
    }
    @Post()
    async create(@Body() dto: CreateUserDto) {
        const result = await this.usersService.create(dto);
        return result;
    }
    @Put(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdatePasswordDto
    ) {
        // try {
        const result = await this.usersService.update(id, dto);
        return result;
        // } catch (err) {
        //     console.error(err);
        //     throw new NotFoundException('User not found');
        // }
    }
    @HttpCode(204)
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.usersService.delete(id);
        return result;
    }
}
