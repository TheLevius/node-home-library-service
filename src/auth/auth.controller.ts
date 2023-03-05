import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenValidationPipe } from './validation/refreshToken.pipe';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Public()
    @Post('signup')
    async signUp(@Body() dto: CreateUserDto) {
        return this.authService.create(dto);
    }
    @Public()
    @HttpCode(200)
    @Post('login')
    async login(@Body() dto: CreateUserDto) {
        return this.authService.login(dto);
    }
    @HttpCode(200)
    @Post('refresh')
    async refresh(
        @Body('refreshToken', RefreshTokenValidationPipe)
        dto: string
    ) {
        return this.authService.refresh(dto);
    }
}
