import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';

@Module({
    imports: [DbModule],
    providers: [AlbumsService],
    controllers: [AlbumsController],
})
export class AlbumsModule {}
