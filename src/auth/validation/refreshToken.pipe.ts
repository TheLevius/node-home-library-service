import {
    PipeTransform,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { isJWT } from 'class-validator';

@Injectable()
export class RefreshTokenValidationPipe implements PipeTransform {
    transform(refreshToken: string) {
        if (!isJWT(refreshToken)) {
            throw new UnauthorizedException('refreshToken is required');
        }
        return refreshToken;
    }
}
