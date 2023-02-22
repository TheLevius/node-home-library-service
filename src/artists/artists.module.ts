import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';

@Module({
    imports: [DbModule],
    controllers: [ArtistsController],
    providers: [ArtistsService],
})
export class ArtistsModule {}
