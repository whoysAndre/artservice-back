import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ResendModule } from '../email/resend.module';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  imports: [PrismaModule, ResendModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
