import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';

@Module({
    imports: [DbModule],
    controllers: [TracksController],
    providers: [TracksService],
})
export class TracksModule {}
