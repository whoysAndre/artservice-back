import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { DeveloperProfileController } from './developer-profile.controller';
import { DeveloperProfileService } from './developer-profile.service';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [DeveloperProfileController],
  providers: [DeveloperProfileService],
})
export class DeveloperProfileModule {}
