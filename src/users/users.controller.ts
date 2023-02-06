import {
    BadRequestException,
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
import { Statuses } from 'src/db/interfaces/statuses.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Get()
    getAll() {
        const result = this.usersService.findAll();
        return result;
    }
    @Get(':id')
    getOne(@Param('id', ParseUUIDPipe) id: string) {
        const result = this.usersService.findOneById(id);
        if (result.status === Statuses.Failed) {
            throw new BadRequestException('User not found');
        }
        return result.row;
    }
    @Post()
    create(@Body() dto: CreateUserDto) {
        const result = this.usersService.create(dto);
        if (result.status === Statuses.Failed) {
            throw new BadRequestException('Bad Request');
        }
        return result.row;
    }
    @Put(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdatePasswordDto
    ) {
        const result = this.usersService.update(id, dto);
        if (result.status === Statuses.Failed) {
            throw new BadRequestException('Bad Request');
        }
        return result.row;
    }
    @HttpCode(204)
    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        const result = this.usersService.delete(id);
        if (result.status === Statuses.Failed) {
            throw new BadRequestException('Bad Request');
        }
        return result.row;
    }
}
